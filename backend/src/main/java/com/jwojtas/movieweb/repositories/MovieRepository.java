package com.jwojtas.movieweb.repositories;

import com.jwojtas.movieweb.entities.Movie;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findByName(String name);
    boolean existsByName(String name);
}

