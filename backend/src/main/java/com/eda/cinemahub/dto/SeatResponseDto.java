package com.eda.cinemahub.dto;

public class SeatResponseDto {

    private Long id;
    private Integer rowNumber;
    private Integer seatNumber;
    private Long hallId;
    private String hallName;

    public SeatResponseDto() {
    }

    public SeatResponseDto(Long id, Integer rowNumber, Integer seatNumber, Long hallId, String hallName) {
        this.id = id;
        this.rowNumber = rowNumber;
        this.seatNumber = seatNumber;
        this.hallId = hallId;
        this.hallName = hallName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getHallName() {
        return hallName;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
    }
}