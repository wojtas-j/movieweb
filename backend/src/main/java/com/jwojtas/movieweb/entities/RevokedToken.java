package com.jwojtas.movieweb.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "revoked_tokens")
public class RevokedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token", nullable = false, unique = true, length = 2048)
    private String token;

    public RevokedToken() {}

    public RevokedToken(String token) {
        this.token = token;
    }
}
