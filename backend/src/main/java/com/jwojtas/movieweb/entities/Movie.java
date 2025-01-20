package com.jwojtas.movieweb.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;


@Entity
@Data
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 100)
    @NotBlank(message = "Movie name cannot be blank")
    @Size(max = 100, message = "Movie name cannot exceed 100 characters")
    private String name;


    @Column(nullable = false, length = 1000)
    @NotBlank(message = "Movie description cannot be blank")
    @Size(max = 1000, message = "Movie description cannot exceed 1000 characters")
    private String description;


    @Column(nullable = false)
    @DecimalMin(value = "0.0", inclusive = true, message = "Rating must be at least 0.0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Rating must be at most 10.0")
    private Double rating;


    @Column(name = "release_date", nullable = false)
    @PastOrPresent(message = "Release date cannot be in the future")
    private LocalDate releaseDate;


    @Column(nullable = false, length = 100)
    @NotBlank(message = "Director name cannot be blank")
    @Size(max = 100, message = "Director name cannot exceed 100 characters")
    private String director;


    @Column(name = "image_url", nullable = false)
    @NotBlank(message = "Image URL cannot be blank")
    @Pattern(regexp = "^(http|https)://.*$", message = "Image URL must start with http:// or https://")
    private String imageUrl;
}

