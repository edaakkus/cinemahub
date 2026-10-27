package com.eda.cinemahub.service;

import com.eda.cinemahub.dto.MovieRequestDto;
import com.eda.cinemahub.dto.MovieResponseDto;
import com.eda.cinemahub.entity.Movie;
import com.eda.cinemahub.exception.MovieNotFoundException;
import com.eda.cinemahub.repository.MovieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private static final Logger logger =
            LoggerFactory.getLogger(MovieService.class);

    private final MovieRepository movieRepository;

    // Constructor Injection: Spring bu constructor'ı gördüğünde
    // MovieRepository'nin implementasyonunu otomatik olarak enjekte eder.
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<MovieResponseDto> getAllMovies() {

        logger.info("Fetching all movies.");

        return movieRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public MovieResponseDto getMovieById(Long id) {

        logger.info("Fetching movie with id={}", id);

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Movie not found. Id={}", id);
                    return new MovieNotFoundException(id);
                });

        logger.info("Movie found successfully. Id={}", id);

        return toResponseDto(movie);
    }

    public MovieResponseDto createMovie(MovieRequestDto requestDto) {

        logger.info("Creating movie: {}", requestDto.getTitle());

        Movie movie = new Movie(
                requestDto.getTitle(),
                requestDto.getGenre(),
                requestDto.getDuration(),
                requestDto.getReleaseYear(),
                requestDto.getPosterUrl(),
                requestDto.getBackdropUrl(),
                requestDto.getSynopsis(),
                requestDto.getRating(),
                requestDto.getDirector(),
                requestDto.getAgeRating(),
                requestDto.getTrailerUrl()
        );

        Movie savedMovie = movieRepository.save(movie);

        logger.info("Movie created successfully. Id={}", savedMovie.getId());

        return toResponseDto(savedMovie);
    }

    public MovieResponseDto updateMovie(Long id, MovieRequestDto requestDto) {

        logger.info("Updating movie with id={}", id);

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Movie not found. Id={}", id);
                    return new MovieNotFoundException(id);
                });

        movie.setTitle(requestDto.getTitle());
        movie.setGenre(requestDto.getGenre());
        movie.setDuration(requestDto.getDuration());
        movie.setReleaseYear(requestDto.getReleaseYear());
        if (requestDto.getPosterUrl() != null) movie.setPosterUrl(requestDto.getPosterUrl());
        if (requestDto.getBackdropUrl() != null) movie.setBackdropUrl(requestDto.getBackdropUrl());
        if (requestDto.getSynopsis() != null) movie.setSynopsis(requestDto.getSynopsis());
        if (requestDto.getRating() != null) movie.setRating(requestDto.getRating());
        if (requestDto.getDirector() != null) movie.setDirector(requestDto.getDirector());
        if (requestDto.getAgeRating() != null) movie.setAgeRating(requestDto.getAgeRating());
        if (requestDto.getTrailerUrl() != null) movie.setTrailerUrl(requestDto.getTrailerUrl());

        Movie updatedMovie = movieRepository.save(movie);

        logger.info("Movie updated successfully. Id={}", updatedMovie.getId());

        return toResponseDto(updatedMovie);
    }

    public void deleteMovie(Long id) {

        logger.info("Deleting movie with id={}", id);

        if (!movieRepository.existsById(id)) {
            logger.error("Movie not found. Id={}", id);
            throw new MovieNotFoundException(id);
        }

        movieRepository.deleteById(id);

        logger.info("Movie deleted successfully. Id={}", id);
    }

    Movie findMovieOrThrow(Long id) {
        return movieRepository.findById(id).orElseThrow(() -> new MovieNotFoundException(id));
    }

    // Entity -> DTO dönüşümünü tek bir yerde topluyoruz,
    // her metodda tekrar tekrar yazmamak için.
    private MovieResponseDto toResponseDto(Movie movie) {
        return new MovieResponseDto(
                movie.getId(),
                movie.getTitle(),
                movie.getGenre(),
                movie.getDuration(),
                movie.getReleaseYear(),
                movie.getPosterUrl(),
                movie.getBackdropUrl(),
                movie.getSynopsis(),
                movie.getRating(),
                movie.getDirector(),
                movie.getAgeRating(),
                movie.getTrailerUrl()
        );
    }
}