package com.studentapp.taskmanager.controller;

import com.studentapp.taskmanager.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

/** Turns every kind of error into a small JSON message the frontend can show to the user. */
@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    /** All our own errors (not found, invalid input, ...) carry their own HTTP status. */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> api(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> fields.putIfAbsent(e.getField(), e.getDefaultMessage()));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Validation failed");
        body.put("fields", fields);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class,
            MissingServletRequestParameterException.class})
    public ResponseEntity<Map<String, Object>> badRequest(Exception ex) {
        return ResponseEntity.badRequest().body(Map.of("message", "Missing or malformed input"));
    }

    /** E.g. two people registering the same email at the same instant. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> conflict(DataIntegrityViolationException ex) {
        return ResponseEntity.status(409).body(Map.of("message", "That value already exists"));
    }

    /** Anything unexpected. (Spring's own web errors such as 404/405 are not RuntimeExceptions, so they keep their normal status.) */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> unexpected(RuntimeException ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(500).body(Map.of("message", "Something went wrong on the server"));
    }
}
