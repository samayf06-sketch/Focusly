package com.studentapp.taskmanager.exception;

/** The user sent missing or wrong data (HTTP 400). */
public class InvalidInputException extends ApiException {
    public InvalidInputException(String message) {
        super(400, message);
    }
}
