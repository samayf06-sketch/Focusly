package com.studentapp.taskmanager.config;

import com.studentapp.taskmanager.exception.UnauthorizedException;
import com.studentapp.taskmanager.model.User;
import com.studentapp.taskmanager.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Protects the API. Every request must carry "Authorization: Bearer &lt;token&gt;".
 * On success the user id is stored in the request so controllers know who is calling.
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    public static final String USER_ID = "userId";
    public static final String TOKEN = "authToken";

    private final AuthService auth;

    public AuthInterceptor(AuthService auth) {
        this.auth = auth;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Let CORS pre-flight requests through
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String header = request.getHeader("Authorization");
        String token = (header != null && header.startsWith("Bearer ")) ? header.substring(7).trim() : null;

        User user = auth.userForToken(token).orElseThrow(() ->
                new UnauthorizedException("Please log in"));

        request.setAttribute(USER_ID, user.getId());
        request.setAttribute(TOKEN, token);
        return true;
    }
}
