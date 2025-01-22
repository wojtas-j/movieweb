package com.jwojtas.movieweb.service;

import com.jwojtas.movieweb.dto.CreateMovieRequest;
import com.jwojtas.movieweb.dto.MovieDto;
import com.jwojtas.movieweb.dto.UpdateMovieRequest;
import com.jwojtas.movieweb.entities.Movie;
import com.jwojtas.movieweb.exceptions.MovieAlreadyExistsException;
import com.jwojtas.movieweb.exceptions.MovieNotFoundException;
import com.jwojtas.movieweb.repositories.MovieRepository;
import com.jwojtas.movieweb.services.MovieService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @InjectMocks
    private MovieService movieService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void shouldGetAllMoviesSuccessfully() {
        Movie movie1 = new Movie();
        movie1.setId(1L);
        movie1.setName("Movie 1");
        movie1.setDescription("Description 1");
        movie1.setRating(8.5);
        movie1.setReleaseDate(LocalDate.of(2022, 1, 1));
        movie1.setDirector("Director 1");
        movie1.setImageUrl("http://image1.com");

        Movie movie2 = new Movie();
        movie2.setId(2L);
        movie2.setName("Movie 2");
        movie2.setDescription("Description 2");
        movie2.setRating(9.0);
        movie2.setReleaseDate(LocalDate.of(2021, 1, 1));
        movie2.setDirector("Director 2");
        movie2.setImageUrl("http://image2.com");

        when(movieRepository.findAll()).thenReturn(Arrays.asList(movie1, movie2));

        var movies = movieService.getAllMovies();

        assertEquals(2, movies.size());
        verify(movieRepository).findAll();
    }

    @Test
    public void shouldCreateMovieSuccessfully() {
        CreateMovieRequest request = new CreateMovieRequest(
                "New Movie", "Description", 7.5, LocalDate.of(2023, 1, 1), "Director", "http://image.com"
        );

        Movie movie = new Movie();
        movie.setId(1L);
        movie.setName(request.name());
        movie.setDescription(request.description());
        movie.setRating(request.rating());
        movie.setReleaseDate(request.releaseDate());
        movie.setDirector(request.director());
        movie.setImageUrl(request.imageUrl());

        when(movieRepository.existsByName(request.name())).thenReturn(false);
        when(movieRepository.save(any(Movie.class))).thenReturn(movie);

        MovieDto createdMovie = movieService.createMovie(request);

        assertNotNull(createdMovie);
        assertEquals("New Movie", createdMovie.name());
        verify(movieRepository).save(any(Movie.class));
    }

    @Test
    public void shouldThrowExceptionWhenCreatingDuplicateMovie() {
        CreateMovieRequest request = new CreateMovieRequest(
                "Duplicate Movie", "Description", 8.0, LocalDate.of(2023, 1, 1), "Director", "http://image.com"
        );

        when(movieRepository.existsByName(request.name())).thenReturn(true);

        assertThrows(MovieAlreadyExistsException.class, () -> movieService.createMovie(request));
        verify(movieRepository, never()).save(any());
    }

    @Test
    public void shouldUpdateMovieSuccessfully() {
        Movie existingMovie = new Movie();
        existingMovie.setId(1L);
        existingMovie.setName("Old Movie");
        existingMovie.setDescription("Old Description");
        existingMovie.setRating(6.0);
        existingMovie.setReleaseDate(LocalDate.of(2020, 1, 1));
        existingMovie.setDirector("Old Director");
        existingMovie.setImageUrl("http://oldimage.com");

        UpdateMovieRequest request = new UpdateMovieRequest(
                "Updated Movie", "Updated Description", 8.5, LocalDate.of(2023, 1, 1), "Updated Director", "http://updatedimage.com"
        );

        when(movieRepository.findById(1L)).thenReturn(Optional.of(existingMovie));
        when(movieRepository.existsByName(request.name())).thenReturn(false);
        when(movieRepository.save(existingMovie)).thenReturn(existingMovie);

        MovieDto updatedMovie = movieService.updateMovie(1L, request);

        assertEquals("Updated Movie", updatedMovie.name());
        verify(movieRepository).save(existingMovie);
    }

    @Test
    public void shouldThrowExceptionWhenUpdatingNonExistingMovie() {
        UpdateMovieRequest request = new UpdateMovieRequest(
                "Nonexistent Movie", "Description", 7.0, LocalDate.of(2023, 1, 1), "Director", "http://image.com"
        );

        when(movieRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(MovieNotFoundException.class, () -> movieService.updateMovie(1L, request));
    }

    @Test
    public void shouldDeleteMovieSuccessfully() {
        when(movieRepository.existsById(1L)).thenReturn(true);

        movieService.deleteMovie(1L);

        verify(movieRepository).deleteById(1L);
    }

    @Test
    public void shouldThrowExceptionWhenDeletingNonExistingMovie() {
        when(movieRepository.existsById(1L)).thenReturn(false);

        assertThrows(MovieNotFoundException.class, () -> movieService.deleteMovie(1L));
        verify(movieRepository, never()).deleteById(anyLong());
    }
}
