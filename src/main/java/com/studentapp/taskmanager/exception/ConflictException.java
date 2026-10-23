package com.studentapp.taskmanager.exception;

/** The request clashes with existing data, e.g. an email that is already registered (HTTP 409). */
public class ConflictException extends ApiException {
    public ConflictException(String message) {
        super(409, message);
    }
}
