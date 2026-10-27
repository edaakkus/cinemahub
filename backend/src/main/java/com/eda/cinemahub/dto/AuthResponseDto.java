package com.eda.cinemahub.dto;

public class AuthResponseDto {

    private String token;
    private String type = "Bearer";
    private String username;
    private String role;
    private UserResponseDto user;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String token, String username, String role, UserResponseDto user) {
        this.token = token;
        this.type = "Bearer";
        this.username = username;
        this.role = role;
        this.user = user;
    }

    public AuthResponseDto(String token, String username, String role) {
        this.token = token;
        this.type = "Bearer";
        this.username = username;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UserResponseDto getUser() {
        return user;
    }

    public void setUser(UserResponseDto user) {
        this.user = user;
    }
}