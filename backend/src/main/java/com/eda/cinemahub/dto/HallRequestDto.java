package com.eda.cinemahub.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class HallRequestDto {

    @NotBlank(message = "name boş olamaz")
    private String name;

    @Min(value = 1, message = "capacity 0'dan küçük olamaz")
    private Integer capacity;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}