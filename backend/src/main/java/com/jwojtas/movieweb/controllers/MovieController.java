package com.jwojtas.movieweb.controllers;

import com.jwojtas.movieweb.dto.CreateMovieRequest;
import com.jwojtas.movieweb.dto.MovieDto;
import com.jwojtas.movieweb.dto.UpdateMovieRequest;
import com.jwojtas.movieweb.services.Interfaces.MovieServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
public class MovieController {

    private final MovieServiceImpl moviesService;

    @Autowired
    public MovieController(MovieServiceImpl moviesService) {
        this.moviesService = moviesService;
    }
    @GetMapping
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        List<MovieDto> movies = moviesService.getAllMovies();
        return ResponseEntity.ok(movies);
    }

    @PostMapping
    public ResponseEntity<MovieDto> createMovie(@Valid @RequestBody CreateMovieRequest request) {
        MovieDto createdMovie = moviesService.createMovie(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMovie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable Long id, @Valid @RequestBody UpdateMovieRequest request) {

        MovieDto updatedMovie = moviesService.updateMovie(id, request);
        return ResponseEntity.ok(updatedMovie);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        moviesService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}