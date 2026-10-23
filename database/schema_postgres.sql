-- PostgreSQL schema for Smart Task & Deadline Manager
-- Optional: Spring Boot creates these tables automatically (ddl-auto=update).
-- Run manually with:  createdb taskmanager && psql -d taskmanager -f database/schema_postgres.sql

CREATE TABLE IF NOT EXISTS users (
    id               BIGSERIAL PRIMARY KEY,
    name             VARCHAR(80)  NOT NULL,
    email            VARCHAR(160) NOT NULL UNIQUE,
    password_hash    VARCHAR(100) NOT NULL,
    email_reminders  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Login sessions (only a SHA-256 hash of the token is stored)
CREATE TABLE IF NOT EXISTS auth_tokens (
    token_hash  VARCHAR(64) PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users (id) ON DELETE CASCADE,
    title           VARCHAR(150)  NOT NULL,
    description     VARCHAR(1000),
    subject         VARCHAR(80),
    due_date        DATE          NOT NULL,
    priority        VARCHAR(10)   NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    status          VARCHAR(15)   NOT NULL DEFAULT 'TODO'   CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
    estimated_hours DOUBLE PRECISION DEFAULT 1,
    reminder_days   INTEGER          DEFAULT 1,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON tasks (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks (status);
