package com.jwojtas.movieweb.dto;

public record CreateUserRequest(
        String firstName,
        String lastName,
        String username,
        String email,
        String phoneNumber,
        String password,
        boolean isAdmin
) {}
