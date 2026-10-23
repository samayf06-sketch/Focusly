-- MySQL schema for Smart Task & Deadline Manager
-- Optional: Spring Boot creates these tables automatically (ddl-auto=update).
-- Run manually with:  mysql -u root -p < database/schema_mysql.sql

CREATE DATABASE IF NOT EXISTS taskmanager;
USE taskmanager;

CREATE TABLE IF NOT EXISTS users (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(80)  NOT NULL,
    email            VARCHAR(160) NOT NULL UNIQUE,
    password_hash    VARCHAR(100) NOT NULL,
    email_reminders  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Login sessions (only a SHA-256 hash of the token is stored)
CREATE TABLE IF NOT EXISTS auth_tokens (
    token_hash  VARCHAR(64) PRIMARY KEY,
    user_id     BIGINT      NOT NULL,
    expires_at  DATETIME(6) NOT NULL,
    CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,
    title           VARCHAR(150)  NOT NULL,
    description     VARCHAR(1000),
    subject         VARCHAR(80),
    due_date        DATE          NOT NULL,
    priority        VARCHAR(10)   NOT NULL DEFAULT 'MEDIUM',
    status          VARCHAR(15)   NOT NULL DEFAULT 'TODO',
    estimated_hours DOUBLE        DEFAULT 1,
    reminder_days   INT           DEFAULT 1,
    created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at    DATETIME,
    CONSTRAINT chk_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT chk_status   CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_user_due ON tasks (user_id, due_date);
CREATE INDEX idx_tasks_status   ON tasks (status);
