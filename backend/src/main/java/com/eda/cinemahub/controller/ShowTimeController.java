package com.eda.cinemahub.controller;

import com.eda.cinemahub.dto.ShowTimeRequestDto;
import com.eda.cinemahub.dto.ShowTimeResponseDto;
import com.eda.cinemahub.service.ShowTimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@Tag(name = "ShowTime API", description = "Seans yönetim işlemleri")
public class ShowTimeController {

    private final ShowTimeService showTimeService;

    public ShowTimeController(ShowTimeService showTimeService) {
        this.showTimeService = showTimeService;
    }

    @Operation(summary = "Tüm seansları veya filme göre seansları getir")
    @GetMapping
    public ResponseEntity<List<ShowTimeResponseDto>> getAllShowTimes(
            @RequestParam(required = false) Long movieId) {
        if (movieId != null) {
            return ResponseEntity.ok(showTimeService.getShowTimesByMovieId(movieId));
        }
        return ResponseEntity.ok(showTimeService.getAllShowTimes());
    }

    @Operation(summary = "ID ile seans getir")
    @GetMapping("/{id}")
    public ResponseEntity<ShowTimeResponseDto> getShowTimeById(@PathVariable Long id) {
        return ResponseEntity.ok(showTimeService.getShowTimeById(id));
    }

    @Operation(summary = "Yeni seans oluştur")
    @PostMapping
    public ResponseEntity<ShowTimeResponseDto> createShowTime(
            @Valid @RequestBody ShowTimeRequestDto requestDto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(showTimeService.createShowTime(requestDto));
    }

    @Operation(summary = "Seans bilgilerini güncelle")
    @PutMapping("/{id}")
    public ResponseEntity<ShowTimeResponseDto> updateShowTime(
            @PathVariable Long id,
            @Valid @RequestBody ShowTimeRequestDto requestDto) {

        return ResponseEntity.ok(showTimeService.updateShowTime(id, requestDto));
    }

    @Operation(summary = "Seansı sil")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowTime(@PathVariable Long id) {
        showTimeService.deleteShowTime(id);
        return ResponseEntity.noContent().build();
    }
}