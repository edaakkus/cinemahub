package com.eda.cinemahub.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SeatRequestDto {

    @NotNull(message = "rowNumber boş olamaz")
    @Min(value = 1, message = "rowNumber 0'dan küçük olamaz")
    private Integer rowNumber;

    @NotNull(message = "seatNumber boş olamaz")
    @Min(value = 1, message = "seatNumber 0'dan küçük olamaz")
    private Integer seatNumber;

    @NotNull(message = "hallId boş olamaz")
    private Long hallId;

    public Integer getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(Integer rowNumber) {
        this.rowNumber = rowNumber;
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Long getHallId() {
        return hallId;
    }

    public void setHallId(Long hallId) {
        this.hallId = hallId;
    }
}