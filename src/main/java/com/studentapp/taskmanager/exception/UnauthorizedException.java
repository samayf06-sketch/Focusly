package com.studentapp.taskmanager.exception;

/** Not logged in, or wrong email/password (HTTP 401). */
public class UnauthorizedException extends ApiException {
    public UnauthorizedException(String message) {
        super(401, message);
    }
}
