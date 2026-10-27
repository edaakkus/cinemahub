package com.eda.cinemahub.service;

import com.eda.cinemahub.dto.HallRequestDto;
import com.eda.cinemahub.dto.HallResponseDto;
import com.eda.cinemahub.entity.Hall;
import com.eda.cinemahub.exception.HallNotFoundException;
import com.eda.cinemahub.repository.HallRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HallService {

    private static final Logger logger =
            LoggerFactory.getLogger(HallService.class);

    private final HallRepository hallRepository;

    public HallService(HallRepository hallRepository) {
        this.hallRepository = hallRepository;
    }

    public List<HallResponseDto> getAllHalls() {

        logger.info("Fetching all halls.");

        return hallRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public HallResponseDto getHallById(Long id) {

        logger.info("Fetching hall with id={}", id);

        Hall hall = findHallOrThrow(id);

        logger.info("Hall found successfully. Id={}", id);

        return toResponseDto(hall);
    }

    public HallResponseDto createHall(HallRequestDto requestDto) {

        logger.info("Creating hall: {}", requestDto.getName());

        Hall hall = new Hall(
                requestDto.getName(),
                requestDto.getCapacity()
        );

        Hall savedHall = hallRepository.save(hall);

        logger.info("Hall created successfully. Id={}", savedHall.getId());

        return toResponseDto(savedHall);
    }

    public HallResponseDto updateHall(Long id, HallRequestDto requestDto) {

        logger.info("Updating hall with id={}", id);

        Hall hall = findHallOrThrow(id);

        hall.setName(requestDto.getName());
        hall.setCapacity(requestDto.getCapacity());

        Hall updatedHall = hallRepository.save(hall);

        logger.info("Hall updated successfully. Id={}", id);

        return toResponseDto(updatedHall);
    }

    public void deleteHall(Long id) {

        logger.info("Deleting hall with id={}", id);

        Hall hall = findHallOrThrow(id);

        hallRepository.delete(hall);

        logger.info("Hall deleted successfully. Id={}", id);
    }

    Hall findHallOrThrow(Long id) {

        return hallRepository.findById(id)
                .orElseThrow(() -> {

                    logger.error("Hall not found. Id={}", id);

                    return new HallNotFoundException(id);
                });
    }

    private HallResponseDto toResponseDto(Hall hall) {

        return new HallResponseDto(
                hall.getId(),
                hall.getName(),
                hall.getCapacity()
        );
    }
}