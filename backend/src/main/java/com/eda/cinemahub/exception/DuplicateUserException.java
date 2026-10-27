package com.eda.cinemahub.exception;

// "Bulunamadı" değil "zaten var" durumu olduğu için ResourceNotFoundException'dan türetmiyoruz.
public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
}