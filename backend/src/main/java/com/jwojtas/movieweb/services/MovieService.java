package com.jwojtas.movieweb.services;

import com.jwojtas.movieweb.dto.CreateMovieRequest;
import com.jwojtas.movieweb.dto.MovieDto;
import com.jwojtas.movieweb.dto.UpdateMovieRequest;
import com.jwojtas.movieweb.entities.Movie;
import com.jwojtas.movieweb.exceptions.MovieAlreadyExistsException;
import com.jwojtas.movieweb.exceptions.MovieNotFoundException;
import com.jwojtas.movieweb.repositories.MovieRepository;
import com.jwojtas.movieweb.services.Interfaces.MovieServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MovieService implements MovieServiceImpl {

    private final MovieRepository moviesRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.moviesRepository = movieRepository;
    }

    @Override
    public List<MovieDto> getAllMovies() {
        return moviesRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public MovieDto getMovieById(Long id) {
        Movie movie = moviesRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie with ID " + id + " not found"));
        return convertToDto(movie);
    }

    @Override
    public MovieDto createMovie(CreateMovieRequest request) {
        if (moviesRepository.existsByName(request.name())) {
            throw new MovieAlreadyExistsException("Movie with name '" + request.name() + "' already exists");
        }
        Movie movie = new Movie();
        movie.setName(request.name());
        movie.setDescription(request.description());
        movie.setRating(request.rating());
        movie.setReleaseDate(request.releaseDate());
        movie.setDirector(request.director());
        movie.setImageUrl(request.imageUrl());

        Movie savedMovie = moviesRepository.save(movie);
        return convertToDto(savedMovie);
    }

    @Override
    public MovieDto updateMovie(Long id, UpdateMovieRequest request) {
        Movie existing = moviesRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie with ID " + id + " not found"));

        if (!existing.getName().equals(request.name()) && moviesRepository.existsByName(request.name())) {
            throw new MovieAlreadyExistsException("Movie with name '" + request.name() + "' already exists");
        }

        existing.setName(request.name());
        existing.setDescription(request.description());
        existing.setRating(request.rating());
        existing.setReleaseDate(request.releaseDate());
        existing.setDirector(request.director());
        existing.setImageUrl(request.imageUrl());

        Movie updatedMovie = moviesRepository.save(existing);
        return convertToDto(updatedMovie);
    }

    @Override
    public void deleteMovie(Long id) {
        boolean exists = moviesRepository.existsById(id);
        if (!exists) {
            throw new MovieNotFoundException("Movie with ID " + id + " does not exist");
        }
        moviesRepository.deleteById(id);
    }

    private MovieDto convertToDto(Movie movie) {
        return new MovieDto(
                movie.getId(),
                movie.getName(),
                movie.getDescription(),
                movie.getRating(),
                movie.getReleaseDate(),
                movie.getDirector(),
                movie.getImageUrl()
        );
    }
}
