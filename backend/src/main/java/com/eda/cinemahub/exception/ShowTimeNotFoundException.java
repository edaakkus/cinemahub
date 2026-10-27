package com.eda.cinemahub.exception;

public class ShowTimeNotFoundException extends ResourceNotFoundException {
    public ShowTimeNotFoundException(Long id) {
        super("ShowTime not found with id: " + id);
    }
}