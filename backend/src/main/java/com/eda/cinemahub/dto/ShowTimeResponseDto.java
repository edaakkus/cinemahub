package com.eda.cinemahub.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ShowTimeResponseDto {

    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long hallId;
    private String hallName;
    private LocalDateTime startTime;
    private BigDecimal price;

    public ShowTimeResponseDto() {
    }

    public ShowTimeResponseDto(Long id, Long movieId, String movieTitle, Long hallId, String hallName,
                                LocalDateTime startTime, BigDecimal price) {
        this.id = id;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.hallId = hallId;
        this.hallName = hallName;
        this.startTime = startTime;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public Long getHallId() {
        return hallId;
    }

    public void setHallId(Long hallId) {
        this.hallId = hallId;
    }

    public String getHallName() {
        return hallName;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
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