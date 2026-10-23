package com.studentapp.taskmanager.service;

import com.studentapp.taskmanager.model.Status;
import com.studentapp.taskmanager.model.Task;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * The default scoring rule.
 * score = deadline urgency (0-60) + user priority (6 / 18 / 30) + effort (0-10) + 3 if already started.
 */
@Component
public class SmartScorer implements ScoringStrategy {

    @Override
    public double score(Task task, LocalDate today) {
        if (task.getStatus() == Status.DONE) {
            return 0;
        }

        long daysLeft = ChronoUnit.DAYS.between(today, task.getDueDate());
        double urgency;
        if (daysLeft < 0) {
            urgency = 60;                                // overdue: always on top
        } else {
            urgency = 60 * Math.exp(-daysLeft / 4.0);    // fades as the deadline gets far away
        }

        double priority = switch (task.getPriority()) {
            case HIGH -> 30;
            case MEDIUM -> 18;
            case LOW -> 6;
        };

        double hours = task.getEstimatedHours() == null ? 1 : task.getEstimatedHours();
        // Big tasks due soon need an early start, so effort matters less when the deadline is far away.
        double effort = Math.min(hours, 10);
        if (daysLeft > 7) {
            effort *= 0.3;
        }

        double total = urgency + priority + effort;
        if (task.getStatus() == Status.IN_PROGRESS) {
            total += 3;                                  // finish what you started
        }
        return Math.round(total * 10.0) / 10.0;
    }
}
