package com.eda.cinemahub.exception;

public class MovieNotFoundException extends ResourceNotFoundException {
    public MovieNotFoundException(Long id) {
        super("Movie not found with id: " + id);
    }
}