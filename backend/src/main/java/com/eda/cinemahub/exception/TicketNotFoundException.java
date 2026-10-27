package com.eda.cinemahub.exception;

public class TicketNotFoundException extends ResourceNotFoundException {
    public TicketNotFoundException(Long id) {
        super("Ticket not found with id: " + id);
    }
}