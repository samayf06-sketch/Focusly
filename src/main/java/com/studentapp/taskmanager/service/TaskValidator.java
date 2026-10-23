package com.studentapp.taskmanager.service;

import com.studentapp.taskmanager.exception.InvalidInputException;
import com.studentapp.taskmanager.model.Task;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/** Checks task data and throws a clear InvalidInputException for wrong or missing input. */
@Component
public class TaskValidator {

    private static final LocalDate EARLIEST = LocalDate.of(2000, 1, 1);
    private static final LocalDate LATEST = LocalDate.of(2100, 12, 31);

    public void validate(Task task) {
        if (task == null) {
            throw new InvalidInputException("Task data is missing");
        }
        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new InvalidInputException("Title is required");
        }
        if (task.getTitle().length() > 150) {
            throw new InvalidInputException("Title must be 150 characters or fewer");
        }
        if (task.getDueDate() == null) {
            throw new InvalidInputException("Due date is required");
        }
        if (task.getDueDate().isBefore(EARLIEST) || task.getDueDate().isAfter(LATEST)) {
            throw new InvalidInputException("Due date looks wrong. Please check the year");
        }
        Double hours = task.getEstimatedHours();
        if (hours != null && (hours <= 0 || hours > 100)) {
            throw new InvalidInputException("Estimated hours must be more than 0 and at most 100");
        }
        Integer reminder = task.getReminderDays();
        if (reminder != null && (reminder < 0 || reminder > 30)) {
            throw new InvalidInputException("Reminder days must be between 0 and 30");
        }
    }
}
