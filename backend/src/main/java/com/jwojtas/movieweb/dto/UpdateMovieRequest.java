package com.jwojtas.movieweb.dto;

import java.time.LocalDate;

public record UpdateMovieRequest(
        String name,
        String description,
        Double rating,
        LocalDate releaseDate,
        String director,
        String imageUrl
) {
}
