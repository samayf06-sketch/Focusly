package com.studentapp.taskmanager.service;

import com.studentapp.taskmanager.exception.InvalidInputException;
import com.studentapp.taskmanager.model.Task;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TaskValidatorTest {

    private final TaskValidator validator = new TaskValidator();

    private Task validTask() {
        Task t = new Task();
        t.setTitle("Chemistry report");
        t.setDueDate(LocalDate.of(2026, 11, 2));
        t.setEstimatedHours(3.0);
        t.setReminderDays(2);
        return t;
    }

    @Test
    @DisplayName("A normal task passes validation")
    void validTaskPasses() {
        validator.validate(validTask());   // must not throw
    }

    @Test
    @DisplayName("A blank title is rejected with a clear message")
    void blankTitleIsRejected() {
        Task t = validTask();
        t.setTitle("   ");
        InvalidInputException ex = assertThrows(InvalidInputException.class, () -> validator.validate(t));
        assertEquals("Title is required", ex.getMessage());
        assertEquals(400, ex.getStatus());
    }

    @Test
    @DisplayName("A missing due date is rejected")
    void missingDueDateIsRejected() {
        Task t = validTask();
        t.setDueDate(null);
        assertThrows(InvalidInputException.class, () -> validator.validate(t));
    }

    @Test
    @DisplayName("A due date with an obviously wrong year is rejected")
    void absurdDueDateIsRejected() {
        Task t = validTask();
        t.setDueDate(LocalDate.of(1999, 5, 1));
        assertThrows(InvalidInputException.class, () -> validator.validate(t));
    }

    @Test
    @DisplayName("Zero or huge estimated hours are rejected")
    void badEstimatedHoursAreRejected() {
        Task zero = validTask();
        zero.setEstimatedHours(0.0);
        assertThrows(InvalidInputException.class, () -> validator.validate(zero));

        Task huge = validTask();
        huge.setEstimatedHours(500.0);
        assertThrows(InvalidInputException.class, () -> validator.validate(huge));
    }

    @Test
    @DisplayName("A negative reminder window is rejected")
    void negativeReminderDaysAreRejected() {
        Task t = validTask();
        t.setReminderDays(-1);
        assertThrows(InvalidInputException.class, () -> validator.validate(t));
    }

    @Test
    @DisplayName("A missing task object is rejected instead of crashing")
    void nullTaskIsRejected() {
        assertThrows(InvalidInputException.class, () -> validator.validate(null));
    }
}
