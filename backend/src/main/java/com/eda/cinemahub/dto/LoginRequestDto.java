package com.eda.cinemahub.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDto {

    private String username;
    private String email;

    @NotBlank(message = "password boş olamaz")
    private String password;

    public String getUsername() {
        if (username != null && !username.isBlank()) {
            return username;
        }
        return email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}