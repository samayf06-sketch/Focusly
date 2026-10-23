package com.studentapp.taskmanager.service;

import com.studentapp.taskmanager.dto.StatsView;
import com.studentapp.taskmanager.dto.TaskView;
import com.studentapp.taskmanager.model.Priority;
import com.studentapp.taskmanager.model.Status;
import com.studentapp.taskmanager.model.Task;
import com.studentapp.taskmanager.repository.TaskRepository;
import com.studentapp.taskmanager.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/** All task operations are scoped to one user: nobody can see or change another user's tasks. */
@Service
@Transactional
public class TaskService {

    private final TaskRepository repo;
    private final ScoringStrategy scorer;
    private final TaskValidator validator;

    public TaskService(TaskRepository repo, ScoringStrategy scorer, TaskValidator validator) {
        this.repo = repo;
        this.scorer = scorer;
        this.validator = validator;
    }

    // ---------- CRUD ----------

    @Transactional(readOnly = true)
    public List<TaskView> list(Long userId, Optional<Status> status, Optional<String> subject, String sort) {
        LocalDate today = LocalDate.now();
        List<TaskView> views = repo.findByUserId(userId).stream()
                .filter(t -> status.map(s -> t.getStatus() == s).orElse(true))
                .filter(t -> subject.map(s -> s.equalsIgnoreCase(nullToEmpty(t.getSubject()))).orElse(true))
                .map(t -> TaskView.of(t, today, scorer.score(t, today)))
                .collect(Collectors.toList());

        Comparator<TaskView> cmp = switch (sort == null ? "smart" : sort) {
            case "due" -> Comparator.comparing(TaskView::dueDate);
            case "priority" -> Comparator.comparing(TaskView::priority).reversed()
                    .thenComparing(TaskView::dueDate);
            case "title" -> Comparator.comparing(v -> v.title().toLowerCase());
            default -> Comparator.comparingDouble(TaskView::score).reversed();
        };
        // finished tasks always sink to the bottom
        views.sort(Comparator.comparing((TaskView v) -> v.status() == Status.DONE).thenComparing(cmp));
        return views;
    }

    @Transactional(readOnly = true)
    public TaskView get(Long userId, Long id) {
        return view(find(userId, id));
    }

    public TaskView create(Long userId, Task input) {
        validator.validate(input);
        input.setId(null);
        input.setUserId(userId);
        applyDefaults(input);
        applyCompletionTimestamp(input);
        return view(repo.save(input));
    }

    public TaskView update(Long userId, Long id, Task input) {
        validator.validate(input);
        Task existing = find(userId, id);
        existing.setTitle(input.getTitle());
        existing.setDescription(input.getDescription());
        existing.setSubject(input.getSubject());
        existing.setDueDate(input.getDueDate());
        existing.setPriority(input.getPriority() != null ? input.getPriority() : Priority.MEDIUM);
        existing.setStatus(input.getStatus() != null ? input.getStatus() : Status.TODO);
        existing.setEstimatedHours(input.getEstimatedHours() != null ? input.getEstimatedHours() : 1.0);
        existing.setReminderDays(input.getReminderDays() != null ? input.getReminderDays() : 1);
        applyCompletionTimestamp(existing);
        return view(repo.save(existing));
    }

    public TaskView changeStatus(Long userId, Long id, Status status) {
        Task t = find(userId, id);
        t.setStatus(status);
        applyCompletionTimestamp(t);
        return view(repo.save(t));
    }

    public void delete(Long userId, Long id) {
        repo.delete(find(userId, id));
    }

    // ---------- Smart features ----------

    /** Open tasks ranked by the smart score; the first few are "what to do next". */
    @Transactional(readOnly = true)
    public List<TaskView> focus(Long userId, int limit) {
        return list(userId, Optional.empty(), Optional.empty(), "smart").stream()
                .filter(v -> v.status() != Status.DONE)
                .limit(limit)
                .toList();
    }

    /** Open tasks that are overdue or whose reminder window has started. */
    @Transactional(readOnly = true)
    public List<TaskView> reminders(Long userId) {
        return list(userId, Optional.empty(), Optional.empty(), "due").stream()
                .filter(v -> v.overdue() || v.reminderDue())
                .toList();
    }

    @Transactional(readOnly = true)
    public StatsView stats(Long userId) {
        LocalDate today = LocalDate.now();
        List<Task> all = repo.findByUserId(userId);
        long total = all.size();
        long done = all.stream().filter(t -> t.getStatus() == Status.DONE).count();
        long todo = all.stream().filter(t -> t.getStatus() == Status.TODO).count();
        long inProgress = all.stream().filter(t -> t.getStatus() == Status.IN_PROGRESS).count();
        long overdue = all.stream()
                .filter(t -> t.getStatus() != Status.DONE && t.getDueDate().isBefore(today)).count();
        long week = all.stream()
                .filter(t -> t.getStatus() != Status.DONE
                        && !t.getDueDate().isBefore(today)
                        && !t.getDueDate().isAfter(today.plusDays(7))).count();
        double rate = total == 0 ? 0 : Math.round(done * 1000.0 / total) / 10.0;

        Map<String, Long> bySubject = all.stream()
                .filter(t -> t.getStatus() != Status.DONE)
                .collect(Collectors.groupingBy(
                        t -> nullToEmpty(t.getSubject()).isBlank() ? "General" : t.getSubject(),
                        TreeMap::new, Collectors.counting()));

        return new StatsView(total, todo, inProgress, done, overdue, week, rate, bySubject);
    }

    @Transactional(readOnly = true)
    public List<String> subjects(Long userId) {
        return repo.findByUserId(userId).stream()
                .map(Task::getSubject)
                .filter(s -> s != null && !s.isBlank())
                .distinct().sorted().toList();
    }

    /** Adds a few example tasks so a new user can try the app straight away. */
    public int addSampleTasks(Long userId) {
        LocalDate today = LocalDate.now();
        List<Task> samples = new ArrayList<>();
        samples.add(sample(userId, "Physics lab report", "Write up the pendulum experiment", "Physics",
                today.minusDays(1), Priority.HIGH, Status.IN_PROGRESS, 4, 2));
        samples.add(sample(userId, "Calculus problem set", "Chapters 7.1 - 7.4", "Mathematics",
                today.plusDays(1), Priority.HIGH, Status.TODO, 3, 2));
        samples.add(sample(userId, "History essay draft", "1500 words on the Industrial Revolution", "History",
                today.plusDays(4), Priority.MEDIUM, Status.TODO, 5, 3));
        samples.add(sample(userId, "Read Chapter 9", "Organic chemistry reading", "Chemistry",
                today.plusDays(6), Priority.LOW, Status.TODO, 1.5, 1));
        samples.add(sample(userId, "Group project slides", "Finish the slide deck with the team", "Computer Science",
                today.plusDays(10), Priority.MEDIUM, Status.TODO, 6, 3));
        repo.saveAll(samples);
        return samples.size();
    }

    // ---------- helpers ----------

    private Task find(Long userId, Long id) {
        return repo.findByIdAndUserId(id, userId).orElseThrow(() ->
                new NotFoundException("Task " + id + " not found"));
    }

    private TaskView view(Task t) {
        LocalDate today = LocalDate.now();
        return TaskView.of(t, today, scorer.score(t, today));
    }

    private Task sample(Long userId, String title, String description, String subject, LocalDate due,
                        Priority priority, Status status, double hours, int reminderDays) {
        Task t = new Task();
        t.setUserId(userId);
        t.setTitle(title);
        t.setDescription(description);
        t.setSubject(subject);
        t.setDueDate(due);
        t.setPriority(priority);
        t.setStatus(status);
        t.setEstimatedHours(hours);
        t.setReminderDays(reminderDays);
        return t;
    }

    private void applyDefaults(Task t) {
        if (t.getPriority() == null) t.setPriority(Priority.MEDIUM);
        if (t.getStatus() == null) t.setStatus(Status.TODO);
        if (t.getEstimatedHours() == null) t.setEstimatedHours(1.0);
        if (t.getReminderDays() == null) t.setReminderDays(1);
    }

    private void applyCompletionTimestamp(Task t) {
        if (t.getStatus() == Status.DONE) {
            if (t.getCompletedAt() == null) t.setCompletedAt(LocalDateTime.now());
        } else {
            t.setCompletedAt(null);
        }
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}
