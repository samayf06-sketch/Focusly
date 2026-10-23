package com.studentapp.taskmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task extends BaseEntity {

    /** Owner of the task. Never read from the request body; it is set from the logged-in user. */
    @JsonIgnore
    @Column(name = "user_id")
    private Long userId;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @Size(max = 1000)
    @Column(length = 1000)
    private String description;

    @Size(max = 80)
    @Column(length = 80)
    private String subject;

    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Status status = Status.TODO;

    /** Estimated effort in hours, used by the smart priority score. */
    @Column(name = "estimated_hours")
    private Double estimatedHours = 1.0;

    /** Days before the due date at which a reminder should appear. */
    @Column(name = "reminder_days")
    private Integer reminderDays = 1;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // --- getters / setters ---
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; }

    public Integer getReminderDays() { return reminderDays; }
    public void setReminderDays(Integer reminderDays) { this.reminderDays = reminderDays; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
