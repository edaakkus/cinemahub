package com.eda.cinemahub.service;

import com.eda.cinemahub.dto.SeatRequestDto;
import com.eda.cinemahub.dto.SeatResponseDto;
import com.eda.cinemahub.entity.Hall;
import com.eda.cinemahub.entity.Seat;
import com.eda.cinemahub.exception.SeatNotFoundException;
import com.eda.cinemahub.repository.SeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SeatService {

    private static final Logger logger =
            LoggerFactory.getLogger(SeatService.class);

    private final SeatRepository seatRepository;
    private final HallService hallService;

    public SeatService(SeatRepository seatRepository, HallService hallService) {
        this.seatRepository = seatRepository;
        this.hallService = hallService;
    }

    public List<SeatResponseDto> getAllSeats() {

        logger.info("Fetching all seats.");

        return seatRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<SeatResponseDto> getSeatsByHall(Long hallId) {

        logger.info("Fetching seats for hall id={}", hallId);

        return seatRepository.findByHallId(hallId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public SeatResponseDto getSeatById(Long id) {

        logger.info("Fetching seat with id={}", id);

        return toResponseDto(findSeatOrThrow(id));
    }

    public SeatResponseDto createSeat(SeatRequestDto requestDto) {

        logger.info("Creating seat.");

        Hall hall = hallService.findHallOrThrow(requestDto.getHallId());

        Seat seat = new Seat(
                requestDto.getRowNumber(),
                requestDto.getSeatNumber(),
                hall
        );

        Seat savedSeat = seatRepository.save(seat);

        logger.info("Seat created successfully. Id={}", savedSeat.getId());

        return toResponseDto(savedSeat);
    }

    public SeatResponseDto updateSeat(Long id, SeatRequestDto requestDto) {

        logger.info("Updating seat with id={}", id);

        Seat seat = findSeatOrThrow(id);
        Hall hall = hallService.findHallOrThrow(requestDto.getHallId());

        seat.setRowNumber(requestDto.getRowNumber());
        seat.setSeatNumber(requestDto.getSeatNumber());
        seat.setHall(hall);

        Seat updatedSeat = seatRepository.save(seat);

        logger.info("Seat updated successfully. Id={}", updatedSeat.getId());

        return toResponseDto(updatedSeat);
    }

    public void deleteSeat(Long id) {

        logger.info("Deleting seat with id={}", id);

        if (!seatRepository.existsById(id)) {
            logger.error("Seat not found. Id={}", id);
            throw new SeatNotFoundException(id);
        }

        seatRepository.deleteById(id);

        logger.info("Seat deleted successfully. Id={}", id);
    }

    Seat findSeatOrThrow(Long id) {

        return seatRepository.findById(id)
                .orElseThrow(() -> {

                    logger.error("Seat not found. Id={}", id);

                    return new SeatNotFoundException(id);
                });
    }

    private SeatResponseDto toResponseDto(Seat seat) {

        return new SeatResponseDto(
                seat.getId(),
                seat.getRowNumber(),
                seat.getSeatNumber(),
                seat.getHall().getId(),
                seat.getHall().getName()
        );
    }
}