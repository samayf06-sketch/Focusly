package com.studentapp.taskmanager.exception;

/** The requested item does not exist, or belongs to someone else (HTTP 404). */
public class NotFoundException extends ApiException {
    public NotFoundException(String message) {
        super(404, message);
    }
}
