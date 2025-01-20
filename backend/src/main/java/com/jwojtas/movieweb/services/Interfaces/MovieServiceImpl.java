package com.jwojtas.movieweb.services.Interfaces;

import com.jwojtas.movieweb.dto.CreateMovieRequest;
import com.jwojtas.movieweb.dto.MovieDto;
import com.jwojtas.movieweb.dto.UpdateMovieRequest;

import java.util.List;

public interface MovieServiceImpl {
    List<MovieDto> getAllMovies();
    MovieDto getMovieById(Long id);
    MovieDto createMovie(CreateMovieRequest request);
    MovieDto updateMovie(Long id, UpdateMovieRequest request);
    void deleteMovie(Long id);
}
