package com.studentapp.taskmanager.dto;

/** Body of DELETE /api/auth/me: the password confirms the person really wants this. */
public record DeleteAccountRequest(String password) { }
