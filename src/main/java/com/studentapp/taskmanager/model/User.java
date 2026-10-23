package com.studentapp.taskmanager.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    /** No longer used (the email feature was removed). The column stays so existing databases keep working. */
    @Column(name = "email_reminders", nullable = false)
    private boolean emailReminders = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

}
