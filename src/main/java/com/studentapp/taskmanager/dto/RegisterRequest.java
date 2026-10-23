package com.studentapp.taskmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Please enter your name") @Size(max = 80) String name,
        @NotBlank(message = "Please enter your email") @Email(message = "Please enter a valid email") @Size(max = 160) String email,
        @NotBlank(message = "Please choose a password") @Size(min = 8, max = 100, message = "Password must be at least 8 characters") String password
) {
}
