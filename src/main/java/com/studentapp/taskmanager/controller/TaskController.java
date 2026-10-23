package com.studentapp.taskmanager.controller;

import com.studentapp.taskmanager.config.AuthInterceptor;
import com.studentapp.taskmanager.dto.StatsView;
import com.studentapp.taskmanager.exception.InvalidInputException;
import com.studentapp.taskmanager.dto.TaskView;
import com.studentapp.taskmanager.model.Status;
import com.studentapp.taskmanager.model.Task;
import com.studentapp.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping("/tasks")
    public List<TaskView> list(@RequestAttribute(AuthInterceptor.USER_ID) Long userId,
                               @RequestParam(required = false) Status status,
                               @RequestParam(required = false) String subject,
                               @RequestParam(defaultValue = "smart") String sort) {
        return service.list(userId, Optional.ofNullable(status), Optional.ofNullable(subject), sort);
    }

    @GetMapping("/tasks/{id}")
    public TaskView get(@RequestAttribute(AuthInterceptor.USER_ID) Long userId, @PathVariable Long id) {
        return service.get(userId, id);
    }

    @PostMapping("/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskView create(@RequestAttribute(AuthInterceptor.USER_ID) Long userId,
                           @Valid @RequestBody Task task) {
        return service.create(userId, task);
    }

    @PutMapping("/tasks/{id}")
    public TaskView update(@RequestAttribute(AuthInterceptor.USER_ID) Long userId,
                           @PathVariable Long id, @Valid @RequestBody Task task) {
        return service.update(userId, id, task);
    }

    @PatchMapping("/tasks/{id}/status")
    public TaskView changeStatus(@RequestAttribute(AuthInterceptor.USER_ID) Long userId,
                                 @PathVariable Long id, @RequestBody Map<String, String> body) {
        String raw = body.get("status");
        if (raw == null) {
            throw new InvalidInputException("Status is required");
        }
        try {
            return service.changeStatus(userId, id, Status.valueOf(raw));
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Unknown status: " + raw);
        }
    }

    @DeleteMapping("/tasks/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestAttribute(AuthInterceptor.USER_ID) Long userId, @PathVariable Long id) {
        service.delete(userId, id);
    }

    /** Adds a few example tasks for the logged-in user (used by the "Add sample tasks" button). */
    @PostMapping("/tasks/samples")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Integer> addSamples(@RequestAttribute(AuthInterceptor.USER_ID) Long userId) {
        return Map.of("added", service.addSampleTasks(userId));
    }

    @GetMapping("/focus")
    public List<TaskView> focus(@RequestAttribute(AuthInterceptor.USER_ID) Long userId,
                                @RequestParam(defaultValue = "3") int limit) {
        return service.focus(userId, Math.max(1, Math.min(limit, 10)));
    }

    @GetMapping("/reminders")
    public List<TaskView> reminders(@RequestAttribute(AuthInterceptor.USER_ID) Long userId) {
        return service.reminders(userId);
    }

    @GetMapping("/stats")
    public StatsView stats(@RequestAttribute(AuthInterceptor.USER_ID) Long userId) {
        return service.stats(userId);
    }

    @GetMapping("/subjects")
    public List<String> subjects(@RequestAttribute(AuthInterceptor.USER_ID) Long userId) {
        return service.subjects(userId);
    }
}
