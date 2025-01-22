package com.jwojtas.movieweb.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserDto(
        Long id,
        String firstName,
        String lastName,
        String username,
        String email,
        String phoneNumber,
        @JsonProperty("isAdmin") boolean isAdmin
        ) {}

