package com.studentapp.taskmanager.exception;

/** A feature is not set up on the server, e.g. email (HTTP 503). */
public class ServiceUnavailableException extends ApiException {
    public ServiceUnavailableException(String message) {
        super(503, message);
    }
}
