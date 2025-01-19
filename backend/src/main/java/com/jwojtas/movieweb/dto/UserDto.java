package com.jwojtas.movieweb.dto;

public record UserDto(
        Long id,
        String firstName,
        String lastName,
        String username,
        String email,
        String phoneNumber,
        boolean isAdmin
) {}

