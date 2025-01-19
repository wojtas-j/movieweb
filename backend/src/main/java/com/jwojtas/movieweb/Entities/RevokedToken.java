package com.jwojtas.movieweb.Entities;

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
}
