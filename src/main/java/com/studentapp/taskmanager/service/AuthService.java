package com.studentapp.taskmanager.service;

import com.studentapp.taskmanager.dto.SessionView;
import com.studentapp.taskmanager.dto.UserView;
import com.studentapp.taskmanager.exception.ConflictException;
import com.studentapp.taskmanager.exception.InvalidInputException;
import com.studentapp.taskmanager.exception.UnauthorizedException;
import com.studentapp.taskmanager.model.AuthToken;
import com.studentapp.taskmanager.model.User;
import com.studentapp.taskmanager.repository.AuthTokenRepository;
import com.studentapp.taskmanager.repository.TaskRepository;
import com.studentapp.taskmanager.repository.UserRepository;
import com.studentapp.taskmanager.util.TokenHasher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Locale;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    /** Shortest password allowed (also checked in the browser and in RegisterRequest). */
    public static final int MIN_PASSWORD = 8;

    private static final Duration TOKEN_LIFETIME = Duration.ofDays(30);

    private final UserRepository users;
    private final AuthTokenRepository tokens;
    private final PasswordEncoder encoder;
    private final TaskRepository taskRepository;
    private final SecureRandom random = new SecureRandom();

    public AuthService(UserRepository users, AuthTokenRepository tokens, PasswordEncoder encoder,
                       TaskRepository taskRepository) {
        this.users = users;
        this.tokens = tokens;
        this.encoder = encoder;
        this.taskRepository = taskRepository;
    }

    public SessionView register(String name, String email, String password) {
        if (name == null || name.isBlank()) {
            throw new InvalidInputException("Please enter your name");
        }
        if (password == null || password.length() < MIN_PASSWORD) {
            throw new InvalidInputException("Password must be at least " + MIN_PASSWORD + " characters");
        }
        String normalized = normalize(email);
        if (normalized.isEmpty() || !normalized.contains("@")) {
            throw new InvalidInputException("Please enter a valid email");
        }
        if (users.existsByEmail(normalized)) {
            throw new ConflictException("An account with this email already exists");
        }
        User user = new User();
        user.setName(name.trim());
        user.setEmail(normalized);
        user.setPasswordHash(encoder.encode(password));
        users.save(user);
        return openSession(user);
    }

    public SessionView login(String email, String password) {
        User user = users.findByEmail(normalize(email)).orElse(null);
        if (user == null || !encoder.matches(password, user.getPasswordHash())) {
            throw new UnauthorizedException("Wrong email or password");
        }
        return openSession(user);
    }

    public void logout(String rawToken) {
        tokens.deleteById(TokenHasher.sha256(rawToken));
    }

    /** Finds the user a token belongs to, or empty if the token is unknown or expired. */
    @Transactional(readOnly = true)
    public Optional<User> userForToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) return Optional.empty();
        return tokens.findById(TokenHasher.sha256(rawToken))
                .filter(t -> t.getExpiresAt().isAfter(Instant.now()))
                .flatMap(t -> users.findById(t.getUserId()));
    }

    @Transactional(readOnly = true)
    public User getUser(Long userId) {
        return users.findById(userId).orElseThrow(() ->
                new UnauthorizedException("Please log in again"));
    }

    @Transactional(readOnly = true)
    public UserView view(Long userId) {
        return toView(getUser(userId));
    }

    /**
     * Permanently deletes the account: its tasks, its login tokens and the user itself.
     * App stores (Google Play and Apple) require apps with accounts to offer this.
     */
    public void deleteAccount(Long userId, String password) {
        User user = getUser(userId);
        if (password == null || !encoder.matches(password, user.getPasswordHash())) {
            throw new InvalidInputException("Wrong password. Your account was not deleted.");
        }
        taskRepository.deleteByUserId(userId);
        tokens.deleteByUserId(userId);
        users.delete(user);
    }

    // ---------- helpers ----------

    private SessionView openSession(User user) {
        tokens.deleteByExpiresAtBefore(Instant.now());   // tidy up old sessions

        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        tokens.save(new AuthToken(TokenHasher.sha256(rawToken), user.getId(), Instant.now().plus(TOKEN_LIFETIME)));
        return new SessionView(rawToken, toView(user));
    }

    private UserView toView(User user) {
        return UserView.of(user);
    }

    private static String normalize(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }
}
