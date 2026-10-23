package com.studentapp.taskmanager.repository;

import com.studentapp.taskmanager.model.AuthToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface AuthTokenRepository extends JpaRepository<AuthToken, String> {

    long deleteByExpiresAtBefore(Instant time);

    long deleteByUserId(Long userId);
}
