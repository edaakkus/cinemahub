package com.eda.cinemahub.service;

import com.eda.cinemahub.dto.ShowTimeRequestDto;
import com.eda.cinemahub.dto.ShowTimeResponseDto;
import com.eda.cinemahub.entity.Hall;
import com.eda.cinemahub.entity.Movie;
import com.eda.cinemahub.entity.ShowTime;
import com.eda.cinemahub.exception.ShowTimeNotFoundException;
import com.eda.cinemahub.repository.ShowTimeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowTimeService {

    private static final Logger logger =
            LoggerFactory.getLogger(ShowTimeService.class);

    private final ShowTimeRepository showTimeRepository;
    private final MovieService movieService;
    private final HallService hallService;

    public ShowTimeService(ShowTimeRepository showTimeRepository,
                           MovieService movieService,
                           HallService hallService) {
        this.showTimeRepository = showTimeRepository;
        this.movieService = movieService;
        this.hallService = hallService;
    }

    public List<ShowTimeResponseDto> getAllShowTimes() {

        logger.info("Fetching all show times.");

        return showTimeRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<ShowTimeResponseDto> getShowTimesByMovieId(Long movieId) {
        logger.info("Fetching show times for movieId={}", movieId);
        return showTimeRepository.findByMovieId(movieId)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public ShowTimeResponseDto getShowTimeById(Long id) {

        logger.info("Fetching show time with id={}", id);

        ShowTime showTime = findShowTimeOrThrow(id);

        logger.info("Show time found successfully. Id={}", id);

        return toResponseDto(showTime);
    }

    public ShowTimeResponseDto createShowTime(ShowTimeRequestDto requestDto) {

        logger.info("Creating show time.");

        Movie movie = movieService.findMovieOrThrow(requestDto.getMovieId());
        Hall hall = hallService.findHallOrThrow(requestDto.getHallId());

        ShowTime showTime = new ShowTime(
                movie,
                hall,
                requestDto.getStartTime(),
                requestDto.getPrice()
        );

        ShowTime savedShowTime = showTimeRepository.save(showTime);

        logger.info("Show time created successfully. Id={}", savedShowTime.getId());

        return toResponseDto(savedShowTime);
    }

    public ShowTimeResponseDto updateShowTime(Long id, ShowTimeRequestDto requestDto) {

        logger.info("Updating show time with id={}", id);

        ShowTime showTime = findShowTimeOrThrow(id);

        Movie movie = movieService.findMovieOrThrow(requestDto.getMovieId());
        Hall hall = hallService.findHallOrThrow(requestDto.getHallId());

        showTime.setMovie(movie);
        showTime.setHall(hall);
        showTime.setStartTime(requestDto.getStartTime());
        showTime.setPrice(requestDto.getPrice());

        ShowTime updatedShowTime = showTimeRepository.save(showTime);

        logger.info("Show time updated successfully. Id={}", updatedShowTime.getId());

        return toResponseDto(updatedShowTime);
    }

    public void deleteShowTime(Long id) {

        logger.info("Deleting show time with id={}", id);

        if (!showTimeRepository.existsById(id)) {
            logger.error("Show time not found. Id={}", id);
            throw new ShowTimeNotFoundException(id);
        }

        showTimeRepository.deleteById(id);

        logger.info("Show time deleted successfully. Id={}", id);
    }

    ShowTime findShowTimeOrThrow(Long id) {

        return showTimeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Show time not found. Id={}", id);
                    return new ShowTimeNotFoundException(id);
                });
    }

    private ShowTimeResponseDto toResponseDto(ShowTime showTime) {
        return new ShowTimeResponseDto(
                showTime.getId(),
                showTime.getMovie().getId(),
                showTime.getMovie().getTitle(),
                showTime.getHall().getId(),
                showTime.getHall().getName(),
                showTime.getStartTime(),
                showTime.getPrice()
        );
    }
}