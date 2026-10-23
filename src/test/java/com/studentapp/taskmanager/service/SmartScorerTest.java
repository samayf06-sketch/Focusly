package com.studentapp.taskmanager.service;

import com.studentapp.taskmanager.model.Priority;
import com.studentapp.taskmanager.model.Status;
import com.studentapp.taskmanager.model.Task;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SmartScorerTest {

    private final SmartScorer scorer = new SmartScorer();
    private final LocalDate today = LocalDate.of(2026, 10, 13);

    private Task task(int daysFromToday, Priority priority, Status status, Double hours) {
        Task t = new Task();
        t.setTitle("Test task");
        t.setDueDate(today.plusDays(daysFromToday));
        t.setPriority(priority);
        t.setStatus(status);
        t.setEstimatedHours(hours);
        return t;
    }

    @Test
    @DisplayName("An overdue task scores higher than one due tomorrow")
    void overdueTaskScoresHigherThanTaskDueTomorrow() {
        double overdue = scorer.score(task(-1, Priority.MEDIUM, Status.TODO, 2.0), today);
        double tomorrow = scorer.score(task(1, Priority.MEDIUM, Status.TODO, 2.0), today);
        assertTrue(overdue > tomorrow, "overdue=" + overdue + " tomorrow=" + tomorrow);
    }

    @Test
    @DisplayName("With the same deadline, high priority beats low priority")
    void highPriorityBeatsLowPriorityWithSameDeadline() {
        double high = scorer.score(task(3, Priority.HIGH, Status.TODO, 2.0), today);
        double low = scorer.score(task(3, Priority.LOW, Status.TODO, 2.0), today);
        assertTrue(high > low);
    }

    @Test
    @DisplayName("A completed task always scores zero")
    void completedTaskScoresZero() {
        double score = scorer.score(task(-5, Priority.HIGH, Status.DONE, 8.0), today);
        assertEquals(0.0, score, 0.0001);
    }

    @Test
    @DisplayName("Effort matters more when the deadline is close")
    void effortCountsMoreWhenDeadlineIsClose() {
        double nearGap = scorer.score(task(3, Priority.MEDIUM, Status.TODO, 10.0), today)
                - scorer.score(task(3, Priority.MEDIUM, Status.TODO, 1.0), today);
        double farGap = scorer.score(task(20, Priority.MEDIUM, Status.TODO, 10.0), today)
                - scorer.score(task(20, Priority.MEDIUM, Status.TODO, 1.0), today);
        assertTrue(nearGap > farGap, "nearGap=" + nearGap + " farGap=" + farGap);
    }

    @Test
    @DisplayName("A task already in progress gets a small bonus")
    void inProgressTaskGetsBonus() {
        double started = scorer.score(task(4, Priority.MEDIUM, Status.IN_PROGRESS, 2.0), today);
        double notStarted = scorer.score(task(4, Priority.MEDIUM, Status.TODO, 2.0), today);
        assertEquals(3.0, started - notStarted, 0.11);
    }

    @Test
    @DisplayName("Missing estimated hours does not crash the scorer")
    void missingEstimatedHoursIsHandled() {
        double score = scorer.score(task(2, Priority.MEDIUM, Status.TODO, null), today);
        assertTrue(score > 0);
    }
}
