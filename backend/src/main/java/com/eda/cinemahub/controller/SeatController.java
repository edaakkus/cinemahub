package com.eda.cinemahub.controller;

import com.eda.cinemahub.dto.SeatRequestDto;
import com.eda.cinemahub.dto.SeatResponseDto;
import com.eda.cinemahub.service.SeatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@Tag(name = "Seat API", description = "Sinema koltuklarının yönetimi için kullanılan endpointler")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @Operation(
            summary = "Koltukları listele",
            description = "Tüm koltukları listeler. hallId parametresi gönderilirse yalnızca ilgili salona ait koltuklar döndürülür."
    )
    @GetMapping
    public ResponseEntity<List<SeatResponseDto>> getAllSeats(
            @RequestParam(required = false) Long hallId) {
        if (hallId != null) {
            return ResponseEntity.ok(seatService.getSeatsByHall(hallId));
        }
        return ResponseEntity.ok(seatService.getAllSeats());
    }

    @Operation(
            summary = "ID'ye göre koltuk getir",
            description = "Belirtilen ID'ye sahip koltuğun bilgilerini döndürür."
    )
    @GetMapping("/{id}")
    public ResponseEntity<SeatResponseDto> getSeatById(@PathVariable Long id) {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }

    @Operation(
            summary = "Yeni koltuk oluştur",
            description = "Belirtilen salona yeni bir koltuk ekler."
    )
    @PostMapping
    public ResponseEntity<SeatResponseDto> createSeat(
            @Valid @RequestBody SeatRequestDto requestDto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(seatService.createSeat(requestDto));
    }

    @Operation(
            summary = "Koltuk bilgilerini güncelle",
            description = "Belirtilen ID'ye sahip koltuğun bilgilerini günceller."
    )
    @PutMapping("/{id}")
    public ResponseEntity<SeatResponseDto> updateSeat(
            @PathVariable Long id,
            @Valid @RequestBody SeatRequestDto requestDto) {

        return ResponseEntity.ok(seatService.updateSeat(id, requestDto));
    }

    @Operation(
            summary = "Koltuk sil",
            description = "Belirtilen ID'ye sahip koltuğu sistemden siler."
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }
}