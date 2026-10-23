package com.studentapp.taskmanager.dto;

import com.studentapp.taskmanager.model.Priority;
import com.studentapp.taskmanager.model.Status;
import com.studentapp.taskmanager.model.Task;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TaskViewTest {

    private final LocalDate today = LocalDate.of(2026, 10, 13);

    private TaskView view(int daysFromToday, Status status, int reminderDays) {
        Task t = new Task();
        t.setTitle("Essay");
        t.setDueDate(today.plusDays(daysFromToday));
        t.setPriority(Priority.MEDIUM);
        t.setStatus(status);
        t.setEstimatedHours(2.0);
        t.setReminderDays(reminderDays);
        return TaskView.of(t, today, 10.0);
    }

    @Test
    @DisplayName("Urgency label follows the number of days left")
    void urgencyLabelsFollowDaysLeft() {
        assertEquals("OVERDUE", view(-2, Status.TODO, 1).urgency());
        assertEquals("TODAY", view(0, Status.TODO, 1).urgency());
        assertEquals("URGENT", view(2, Status.TODO, 1).urgency());
        assertEquals("SOON", view(5, Status.TODO, 1).urgency());
        assertEquals("LATER", view(20, Status.TODO, 1).urgency());
    }

    @Test
    @DisplayName("A past-due task that is finished is not overdue")
    void finishedTaskIsNeverOverdue() {
        TaskView v = view(-4, Status.DONE, 1);
        assertFalse(v.overdue());
        assertEquals("DONE", v.urgency());
    }

    @Test
    @DisplayName("Days left is counted from today")
    void daysLeftIsCountedFromToday() {
        assertEquals(7, view(7, Status.TODO, 1).daysLeft());
        assertEquals(-3, view(-3, Status.TODO, 1).daysLeft());
    }

    @Test
    @DisplayName("The reminder starts exactly when the reminder window begins")
    void reminderStartsInsideReminderWindow() {
        assertTrue(view(2, Status.TODO, 2).reminderDue());
        assertFalse(view(3, Status.TODO, 2).reminderDue());
        assertFalse(view(-1, Status.TODO, 2).reminderDue());   // overdue is shown separately
    }
}
