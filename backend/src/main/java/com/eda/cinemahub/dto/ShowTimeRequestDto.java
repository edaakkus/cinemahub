package com.eda.cinemahub.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class ShowTimeRequestDto {

    @NotNull(message = "movieId boş olamaz")
    private Long movieId;

    @NotNull(message = "hallId boş olamaz")
    private Long hallId;

    @NotNull(message = "startTime boş olamaz")
    private LocalDateTime startTime;

    @NotNull(message = "price boş olamaz")
    @DecimalMin(value = "0.0", inclusive = false, message = "price 0'dan büyük olmalı")
    private BigDecimal price;

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getHallId() {
        return hallId;
    }

    public void setHallId(Long hallId) {
        this.hallId = hallId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}