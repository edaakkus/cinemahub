package com.eda.cinemahub.exception;

// Tüm "bulunamadı" exception'ları için ortak üst sınıf.
// GlobalExceptionHandler'da tek bir handler ile hepsini yakalayabilmemizi sağlar.
public abstract class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}