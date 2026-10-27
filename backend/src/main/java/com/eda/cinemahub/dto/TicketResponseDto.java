package com.eda.cinemahub.dto;

import java.time.LocalDateTime;

public class TicketResponseDto {

    private Long id;
    private Long showTimeId;
    private String movieTitle;
    private String posterUrl;
    private String hallName;
    private LocalDateTime showStartTime;
    private Long seatId;
    private String seatLabel;
    private java.math.BigDecimal price;
    private Long userId;
    private LocalDateTime purchaseTime;

    public TicketResponseDto() {
    }

    public TicketResponseDto(Long id, Long showTimeId, String movieTitle, String posterUrl,
                              String hallName, LocalDateTime showStartTime, Long seatId,
                              String seatLabel, java.math.BigDecimal price, Long userId,
                              LocalDateTime purchaseTime) {
        this.id = id;
        this.showTimeId = showTimeId;
        this.movieTitle = movieTitle;
        this.posterUrl = posterUrl;
        this.hallName = hallName;
        this.showStartTime = showStartTime;
        this.seatId = seatId;
        this.seatLabel = seatLabel;
        this.price = price;
        this.userId = userId;
        this.purchaseTime = purchaseTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getShowTimeId() {
        return showTimeId;
    }

    public void setShowTimeId(Long showTimeId) {
        this.showTimeId = showTimeId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getHallName() {
        return hallName;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
    }

    public java.math.BigDecimal getPrice() {
        return price;
    }

    public void setPrice(java.math.BigDecimal price) {
        this.price = price;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getShowStartTime() {
        return showStartTime;
    }

    public void setShowStartTime(LocalDateTime showStartTime) {
        this.showStartTime = showStartTime;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public String getSeatLabel() {
        return seatLabel;
    }

    public void setSeatLabel(String seatLabel) {
        this.seatLabel = seatLabel;
    }

    public LocalDateTime getPurchaseTime() {
        return purchaseTime;
    }

    public void setPurchaseTime(LocalDateTime purchaseTime) {
        this.purchaseTime = purchaseTime;
    }
}