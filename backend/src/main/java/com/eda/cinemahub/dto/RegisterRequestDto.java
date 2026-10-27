package com.eda.cinemahub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequestDto {

    private String username;
    private String fullName;
    private String phone;

    @NotBlank(message = "email boş olamaz")
    @Email(message = "geçerli bir email adresi giriniz")
    private String email;

    @NotBlank(message = "password boş olamaz")
    @Size(min = 6, message = "password en az 6 karakter olmalı")
    private String password;

    public String getUsername() {
        if (username != null && !username.isBlank()) {
            return username;
        }
        if (fullName != null && !fullName.isBlank()) {
            return fullName.trim().toLowerCase().replaceAll("\\s+", "_");
        }
        if (email != null && email.contains("@")) {
            return email.split("@")[0];
        }
        return "user_" + System.currentTimeMillis();
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName != null ? fullName : username;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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