package com.eda.cinemahub.controller;

import com.eda.cinemahub.dto.MovieRequestDto;
import com.eda.cinemahub.dto.MovieResponseDto;
import com.eda.cinemahub.service.MovieService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@Tag(name = "Movie API", description = "Film yönetim işlemleri")
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @Operation(summary = "Tüm filmleri getir")
    @GetMapping
    public ResponseEntity<List<MovieResponseDto>> getAllMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String search) {
        List<MovieResponseDto> movies = movieService.getAllMovies();
        if (genre != null && !genre.isBlank() && !genre.equalsIgnoreCase("Tümü")) {
            movies = movies.stream()
                    .filter(m -> m.getGenre() != null && m.getGenre().equalsIgnoreCase(genre))
                    .toList();
        }
        if (search != null && !search.isBlank()) {
            String query = search.toLowerCase().trim();
            movies = movies.stream()
                    .filter(m -> (m.getTitle() != null && m.getTitle().toLowerCase().contains(query)) ||
                                 (m.getDirector() != null && m.getDirector().toLowerCase().contains(query)))
                    .toList();
        }
        return ResponseEntity.ok(movies);
    }

    @Operation(summary = "ID ile film getir")
    @GetMapping("/{id}")
    public ResponseEntity<MovieResponseDto> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @Operation(summary = "Yeni film oluştur")
    @PostMapping
    public ResponseEntity<MovieResponseDto> createMovie(@Valid @RequestBody MovieRequestDto requestDto) {
        MovieResponseDto created = movieService.createMovie(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Film bilgilerini güncelle")
    @PutMapping("/{id}")
    public ResponseEntity<MovieResponseDto> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody MovieRequestDto requestDto) {
        return ResponseEntity.ok(movieService.updateMovie(id, requestDto));
    }

    @Operation(summary = "Film sil")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}