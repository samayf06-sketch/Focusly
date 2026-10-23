package com.studentapp.taskmanager.service;

import com.studentapp.taskmanager.model.Task;

import java.time.LocalDate;

/**
 * Decides how urgent a task is. A higher number means "do this sooner".
 * Keeping this as an interface lets us swap in a different rule later without touching TaskService.
 */
public interface ScoringStrategy {

    double score(Task task, LocalDate today);
}
