package com.eda.cinemahub.dto;

import jakarta.validation.constraints.NotNull;

public class TicketRequestDto {

    @NotNull(message = "showTimeId boş olamaz")
    private Long showTimeId;

    @NotNull(message = "seatId boş olamaz")
    private Long seatId;

    public Long getShowTimeId() {
        return showTimeId;
    }

    public void setShowTimeId(Long showTimeId) {
        this.showTimeId = showTimeId;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }
}