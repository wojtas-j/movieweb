package com.jwojtas.movieweb.controller;

import com.jwojtas.movieweb.controllers.AuthController;
import com.jwojtas.movieweb.dto.LoginRequest;
import com.jwojtas.movieweb.repositories.RevokedTokenRepository;
import com.jwojtas.movieweb.services.Interfaces.UserServiceImpl;
import com.jwojtas.movieweb.tokens.JwtTokenUtil;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AuthControllerTest {

    private MockMvc mockMvc;
    private AuthenticationManager authenticationManager;
    private JwtTokenUtil jwtTokenUtil;
    private RevokedTokenRepository revokedTokenRepository;
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        authenticationManager = Mockito.mock(AuthenticationManager.class);
        jwtTokenUtil = Mockito.mock(JwtTokenUtil.class);
        revokedTokenRepository = Mockito.mock(RevokedTokenRepository.class);
        userService = Mockito.mock(UserServiceImpl.class);

        AuthController authController = new AuthController(
                authenticationManager, jwtTokenUtil, revokedTokenRepository, userService
        );
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    public void testLoginSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest("test", "password");
        Authentication authentication = Mockito.mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtTokenUtil.generateToken("test")).thenReturn("mocked-jwt-token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(cookie().value("JWT", "mocked-jwt-token"));
    }

    @Test
    public void testLoginFailure() throws Exception {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Niepoprawne dane logowania"));
    }

    @Test
    public void testLogout() throws Exception {
        Cookie jwtCookie = new Cookie("JWT", "mocked-jwt");

        when(revokedTokenRepository.save(any())).thenReturn(null);

        mockMvc.perform(post("/api/auth/logout")
                        .cookie(jwtCookie)
                        .contentType("application/json"))
                .andExpect(status().isOk());
    }
}
