package com.eda.cinemahub.service;

import com.eda.cinemahub.dto.TicketRequestDto;
import com.eda.cinemahub.dto.TicketResponseDto;
import com.eda.cinemahub.entity.Seat;
import com.eda.cinemahub.entity.ShowTime;
import com.eda.cinemahub.entity.Ticket;
import com.eda.cinemahub.exception.SeatAlreadyBookedException;
import com.eda.cinemahub.exception.TicketNotFoundException;
import com.eda.cinemahub.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private static final Logger logger =
            LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;
    private final ShowTimeService showTimeService;
    private final SeatService seatService;
    private final com.eda.cinemahub.repository.UserRepository userRepository;

    public TicketService(TicketRepository ticketRepository,
                         ShowTimeService showTimeService,
                         SeatService seatService,
                         com.eda.cinemahub.repository.UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.showTimeService = showTimeService;
        this.seatService = seatService;
        this.userRepository = userRepository;
    }

    public List<TicketResponseDto> getAllTickets() {

        logger.info("Fetching all tickets.");

        return ticketRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<TicketResponseDto> getMyTickets(String username) {
        logger.info("Fetching tickets for user={}", username);
        return ticketRepository.findByUserUsername(username)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<Long> getOccupiedSeatIds(Long showTimeId) {
        logger.info("Fetching occupied seats for showTimeId={}", showTimeId);
        return ticketRepository.findByShowTimeId(showTimeId)
                .stream()
                .map(t -> t.getSeat().getId())
                .toList();
    }

    public TicketResponseDto getTicketById(Long id) {

        logger.info("Fetching ticket with id={}", id);

        Ticket ticket = findTicketOrThrow(id);

        logger.info("Ticket found successfully. Id={}", id);

        return toResponseDto(ticket);
    }

    public TicketResponseDto createTicket(TicketRequestDto requestDto) {
        return createTicket(requestDto, null);
    }

    public TicketResponseDto createTicket(TicketRequestDto requestDto, String username) {

        logger.info(
                "Creating ticket. ShowTimeId={}, SeatId={}, User={}",
                requestDto.getShowTimeId(),
                requestDto.getSeatId(),
                username
        );

        ShowTime showTime =
                showTimeService.findShowTimeOrThrow(requestDto.getShowTimeId());

        Seat seat =
                seatService.findSeatOrThrow(requestDto.getSeatId());

        // İş kuralı: aynı seans + aynı koltuk için ikinci bilet kesilemez.
        boolean alreadyBooked =
                ticketRepository.existsByShowTimeIdAndSeatId(
                        showTime.getId(),
                        seat.getId()
                );

        if (alreadyBooked) {

            logger.warn(
                    "Seat already booked. ShowTimeId={}, SeatId={}",
                    showTime.getId(),
                    seat.getId()
            );

            throw new SeatAlreadyBookedException(
                    showTime.getId(),
                    seat.getId()
            );
        }

        com.eda.cinemahub.entity.User user = null;
        if (username != null && !username.isBlank()) {
            user = userRepository.findByUsername(username)
                    .or(() -> userRepository.findByEmail(username))
                    .orElse(null);
        }

        Ticket ticket = new Ticket(showTime, seat, user, LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        logger.info(
                "Ticket created successfully. Id={}",
                savedTicket.getId()
        );

        return toResponseDto(savedTicket);
    }

    public void deleteTicket(Long id) {

        logger.info("Deleting ticket with id={}", id);

        if (!ticketRepository.existsById(id)) {

            logger.error("Ticket not found. Id={}", id);

            throw new TicketNotFoundException(id);
        }

        ticketRepository.deleteById(id);

        logger.info("Ticket deleted successfully. Id={}", id);
    }

    private Ticket findTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    private TicketResponseDto toResponseDto(Ticket ticket) {

        Seat seat = ticket.getSeat();
        String seatLabel = "R" + seat.getRowNumber() + "-S" + seat.getSeatNumber();
        String posterUrl = ticket.getShowTime().getMovie().getPosterUrl();
        String hallName = ticket.getShowTime().getHall().getName();
        Long userId = ticket.getUser() != null ? ticket.getUser().getId() : null;

        return new TicketResponseDto(
                ticket.getId(),
                ticket.getShowTime().getId(),
                ticket.getShowTime().getMovie().getTitle(),
                posterUrl,
                hallName,
                ticket.getShowTime().getStartTime(),
                seat.getId(),
                seatLabel,
                ticket.getShowTime().getPrice(),
                userId,
                ticket.getPurchaseTime()
        );
    }
}