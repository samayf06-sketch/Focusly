package com.studentapp.taskmanager.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ApiExceptionTest {

    @Test
    @DisplayName("Each error type carries the right HTTP status")
    void eachErrorTypeHasItsOwnStatus() {
        assertEquals(400, new InvalidInputException("x").getStatus());
        assertEquals(401, new UnauthorizedException("x").getStatus());
        assertEquals(404, new NotFoundException("x").getStatus());
        assertEquals(409, new ConflictException("x").getStatus());
        assertEquals(502, new BadGatewayException("x").getStatus());
        assertEquals(503, new ServiceUnavailableException("x").getStatus());
    }

    @Test
    @DisplayName("All errors can be handled through the ApiException parent class")
    void allErrorsShareTheParentClass() {
        ApiException e = new NotFoundException("Task 5 not found");
        assertTrue(e instanceof RuntimeException);
        assertEquals("Task 5 not found", e.getMessage());
    }
}
