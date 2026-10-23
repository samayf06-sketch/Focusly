package com.studentapp.taskmanager.exception;

/**
 * Base class for every error the API reports to the user.
 * Each subclass fixes its own HTTP status code, so the error handler only needs one rule.
 */
public abstract class ApiException extends RuntimeException {

    private final int status;

    protected ApiException(int status, String message) {
        super(message);
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}
