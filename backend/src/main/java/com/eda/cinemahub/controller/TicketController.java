package com.eda.cinemahub.controller;

import com.eda.cinemahub.dto.TicketRequestDto;
import com.eda.cinemahub.dto.TicketResponseDto;
import com.eda.cinemahub.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Ticket API", description = "Sinema bileti yönetim işlemleri")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @Operation(summary = "Tüm biletleri getir")
    @GetMapping
    public ResponseEntity<List<TicketResponseDto>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @Operation(summary = "Kullanıcının kendi biletlerini getir")
    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketResponseDto>> getMyTickets(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(ticketService.getMyTickets(authentication.getName()));
    }

    @Operation(summary = "Bir seanstaki dolu koltukların ID listesini getir")
    @GetMapping("/occupied-seats/{showTimeId}")
    public ResponseEntity<List<Long>> getOccupiedSeats(@PathVariable Long showTimeId) {
        return ResponseEntity.ok(ticketService.getOccupiedSeatIds(showTimeId));
    }

    @Operation(summary = "ID ile bilet getir")
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDto> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @Operation(summary = "Yeni bilet oluştur")
    @PostMapping
    public ResponseEntity<TicketResponseDto> createTicket(
            @Valid @RequestBody TicketRequestDto requestDto,
            Authentication authentication) {

        String username = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ticketService.createTicket(requestDto, username));
    }

    @Operation(summary = "Bilet sil")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {

        ticketService.deleteTicket(id);

        return ResponseEntity.noContent().build();
    }
}