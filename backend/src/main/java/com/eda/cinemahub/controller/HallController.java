package com.eda.cinemahub.controller;

import com.eda.cinemahub.dto.HallRequestDto;
import com.eda.cinemahub.dto.HallResponseDto;
import com.eda.cinemahub.service.HallService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/halls")
@Tag(name = "Hall API", description = "Salon yönetim işlemleri")
public class HallController {

    private final HallService hallService;

    public HallController(HallService hallService) {
        this.hallService = hallService;
    }

    @Operation(summary = "Tüm salonları getir")
    @GetMapping
    public ResponseEntity<List<HallResponseDto>> getAllHalls() {
        return ResponseEntity.ok(hallService.getAllHalls());
    }

    @Operation(summary = "ID ile salon getir")
    @GetMapping("/{id}")
    public ResponseEntity<HallResponseDto> getHallById(@PathVariable Long id) {
        return ResponseEntity.ok(hallService.getHallById(id));
    }

    @Operation(summary = "Yeni salon oluştur")
    @PostMapping
    public ResponseEntity<HallResponseDto> createHall(
            @Valid @RequestBody HallRequestDto requestDto) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(hallService.createHall(requestDto));
    }

    @Operation(summary = "Salon bilgilerini güncelle")
    @PutMapping("/{id}")
    public ResponseEntity<HallResponseDto> updateHall(
            @PathVariable Long id,
            @Valid @RequestBody HallRequestDto requestDto) {

        return ResponseEntity.ok(hallService.updateHall(id, requestDto));
    }

    @Operation(summary = "Salon sil")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHall(@PathVariable Long id) {
        hallService.deleteHall(id);
        return ResponseEntity.noContent().build();
    }
}