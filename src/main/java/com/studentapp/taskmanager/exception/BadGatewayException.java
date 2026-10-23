package com.studentapp.taskmanager.exception;

/** An outside service (the mail server) failed (HTTP 502). */
public class BadGatewayException extends ApiException {
    public BadGatewayException(String message) {
        super(502, message);
    }
}
