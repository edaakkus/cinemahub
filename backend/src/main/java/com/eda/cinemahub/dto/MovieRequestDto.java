package com.eda.cinemahub.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// İstemciden (client) gelen veriyi karşılayan DTO.
// Sadece create/update sırasında ihtiyaç duyulan alanları içerir, id barındırmaz.
public class MovieRequestDto {

    @NotBlank(message = "title boş olamaz")
    @Size(min = 2, max = 100, message = "title 2-100 karakter arasında olmalı")
    private String title;

    @NotBlank(message = "genre boş olamaz")
    private String genre;

    @Min(value = 1, message = "duration 0'dan küçük olamaz")
    @Max(value = 600, message = "duration 600 dakikadan büyük olamaz")
    private Integer duration;

    @Min(value = 1888, message = "releaseYear geçerli bir yıl olmalı")
    private Integer releaseYear;

    private String posterUrl;
    private String backdropUrl;
    private String synopsis;
    private Double rating;
    private String director;
    private String ageRating;
    private String trailerUrl;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getBackdropUrl() {
        return backdropUrl;
    }

    public void setBackdropUrl(String backdropUrl) {
        this.backdropUrl = backdropUrl;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getAgeRating() {
        return ageRating;
    }

    public void setAgeRating(String ageRating) {
        this.ageRating = ageRating;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }
}