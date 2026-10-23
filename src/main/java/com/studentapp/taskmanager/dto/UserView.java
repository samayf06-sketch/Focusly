package com.studentapp.taskmanager.dto;

import com.studentapp.taskmanager.model.User;

public record UserView(Long id, String name, String email) {

    public static UserView of(User u) {
        return new UserView(u.getId(), u.getName(), u.getEmail());
    }
}
