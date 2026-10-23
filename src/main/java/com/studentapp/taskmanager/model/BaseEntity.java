package com.studentapp.taskmanager.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Shared parent of the database entities: every one has an id and a creation time.
 * Task and User inherit these fields instead of repeating them.
 */
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
