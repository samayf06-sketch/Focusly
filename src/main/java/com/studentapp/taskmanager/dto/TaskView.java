package com.studentapp.taskmanager.dto;

import com.studentapp.taskmanager.model.Priority;
import com.studentapp.taskmanager.model.Status;
import com.studentapp.taskmanager.model.Task;

import java.time.LocalDate;

/** A task enriched with calculated deadline information for the frontend. */
public record TaskView(
        Long id,
        String title,
        String description,
        String subject,
        LocalDate dueDate,
        Priority priority,
        Status status,
        Double estimatedHours,
        Integer reminderDays,
        long daysLeft,
        boolean overdue,
        boolean reminderDue,
        String urgency,
        double score
) {
    public static TaskView of(Task t, LocalDate today, double score) {
        long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(today, t.getDueDate());
        boolean open = t.getStatus() != Status.DONE;
        boolean overdue = open && daysLeft < 0;
        boolean reminderDue = open && !overdue
                && t.getReminderDays() != null && daysLeft <= t.getReminderDays();

        String urgency;
        if (!open) urgency = "DONE";
        else if (overdue) urgency = "OVERDUE";
        else if (daysLeft == 0) urgency = "TODAY";
        else if (daysLeft <= 2) urgency = "URGENT";
        else if (daysLeft <= 7) urgency = "SOON";
        else urgency = "LATER";

        return new TaskView(t.getId(), t.getTitle(), t.getDescription(), t.getSubject(),
                t.getDueDate(), t.getPriority(), t.getStatus(), t.getEstimatedHours(),
                t.getReminderDays(), daysLeft, overdue, reminderDue, urgency, score);
    }
}
