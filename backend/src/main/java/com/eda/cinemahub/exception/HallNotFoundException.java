package com.eda.cinemahub.exception;

public class HallNotFoundException extends ResourceNotFoundException {
    public HallNotFoundException(Long id) {
        super("Hall not found with id: " + id);
    }
}