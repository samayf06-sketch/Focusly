-- Demo data for Focusly (PostgreSQL). Run it in DBeaver: open an SQL editor on your database and press Alt+X.
-- Demo login afterwards:  demo@focusly.com  /  demo12345
-- Safe to run more than once: it deletes and recreates only the demo user.

DELETE FROM users WHERE email = 'demo@focusly.com';

INSERT INTO users (name, email, password_hash, email_reminders, created_at)
VALUES ('Demo Student', 'demo@focusly.com', '$2b$10$QhIAuRd/W6KoB1y9EA0AGOWuUF.uzVgH9aVNeF74ngvx4N.G8xXki', FALSE, CURRENT_TIMESTAMP);

INSERT INTO tasks (user_id, title, description, subject, due_date, priority, status, estimated_hours, reminder_days, created_at, completed_at)
SELECT u.id, t.title, t.description, t.subject, CURRENT_DATE + t.days, t.priority, t.status, t.hours, 1, CURRENT_TIMESTAMP,
       CASE WHEN t.status = 'DONE' THEN CURRENT_TIMESTAMP END
FROM users u,
(VALUES
  ('Submit Math Assignment',     'Chapter 5 exercises',            'Mathematics', -1, 'HIGH',   'TODO',        3.0),
  ('Prepare for Chemistry Test', 'Revise organic chemistry',       'Chemistry',    1, 'HIGH',   'IN_PROGRESS', 5.0),
  ('Write English Essay',        '800 words on climate change',    'English',      2, 'MEDIUM', 'TODO',        2.5),
  ('Physics Lab Report',         'Pendulum experiment',            'Physics',      4, 'MEDIUM', 'TODO',        2.0),
  ('History Presentation',       'Slides on World War II',         'History',      6, 'LOW',    'TODO',        4.0),
  ('Read Biology Chapter 3',     'Cell structure notes',           'Biology',     -3, 'LOW',    'DONE',        1.5),
  ('Computer Science Project',   'Finish Spring Boot task manager','Computer Science', 9, 'HIGH','IN_PROGRESS', 8.0)
) AS t(title, description, subject, days, priority, status, hours)
WHERE u.email = 'demo@focusly.com';

SELECT id, name, email FROM users;
SELECT id, user_id, title, subject, due_date, priority, status FROM tasks ORDER BY due_date;
