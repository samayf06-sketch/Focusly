package com.studentapp.taskmanager.dto;

import java.util.Map;

public record StatsView(
        long total,
        long todo,
        long inProgress,
        long done,
        long overdue,
        long dueThisWeek,
        double completionRate,
        Map<String, Long> bySubject
) {
}
