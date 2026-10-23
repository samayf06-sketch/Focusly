package com.studentapp.taskmanager.controller;

import com.studentapp.taskmanager.config.AuthInterceptor;
import com.studentapp.taskmanager.dto.DeleteAccountRequest;
import com.studentapp.taskmanager.dto.LoginRequest;
import com.studentapp.taskmanager.dto.RegisterRequest;
import com.studentapp.taskmanager.dto.SessionView;
import com.studentapp.taskmanager.dto.UserView;
import com.studentapp.taskmanager.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public SessionView register(@Valid @RequestBody RegisterRequest request) {
        return auth.register(request.name(), request.email(), request.password());
    }

    @PostMapping("/login")
    public SessionView login(@Valid @RequestBody LoginRequest request) {
        return auth.login(request.email(), request.password());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestAttribute(AuthInterceptor.TOKEN) String token) {
        auth.logout(token);
    }

    @GetMapping("/me")
    public UserView me(@RequestAttribute(AuthInterceptor.USER_ID) Long userId) {
        return auth.view(userId);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMe(@RequestAttribute(AuthInterceptor.USER_ID) Long userId,
                         @RequestBody DeleteAccountRequest request) {
        auth.deleteAccount(userId, request.password());
    }
}
