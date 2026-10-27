package com.eda.cinemahub.exception;

public class SeatNotFoundException extends ResourceNotFoundException {
    public SeatNotFoundException(Long id) {
        super("Seat not found with id: " + id);
    }
}