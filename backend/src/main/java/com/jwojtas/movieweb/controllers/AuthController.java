package com.jwojtas.movieweb.controllers;

import com.jwojtas.movieweb.dto.UserDto;
import com.jwojtas.movieweb.entities.RevokedToken;
import com.jwojtas.movieweb.entities.User;
import com.jwojtas.movieweb.repositories.RevokedTokenRepository;
import com.jwojtas.movieweb.services.Interfaces.UserServiceImpl;
import com.jwojtas.movieweb.tokens.JwtTokenUtil;
import com.jwojtas.movieweb.dto.LoginRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final RevokedTokenRepository revokedTokenRepository;
    private final UserServiceImpl userService;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil, RevokedTokenRepository revokedTokenRepository, UserServiceImpl userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.revokedTokenRepository = revokedTokenRepository;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        System.out.println("Sprawdzenie");
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String username = authentication.getName();
        User user = userService.getUserByUsername(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        UserDto userDto = new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.isAdmin()
        );

        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
                                   HttpServletResponse response) {

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.username(),
                            loginRequest.password()
                    )
            );

            String jwt = jwtTokenUtil.generateToken(loginRequest.username());

            Cookie cookie = new Cookie("JWT", jwt);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            response.addCookie(cookie);

            return ResponseEntity.ok("Zalogowano pomyślnie.");
        } catch (UsernameNotFoundException | BadCredentialsException e) {
            return ResponseEntity.status(401).body("Niepoprawne dane logowania");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request,
                                    HttpServletResponse response,
                                    Authentication auth) {

        String jwt = null;

        if (request.getCookies() != null) {
            Cookie jwtCookie = Arrays.stream(request.getCookies())
                    .filter(cookie -> "JWT".equals(cookie.getName()))
                    .findFirst()
                    .orElse(null);
            if (jwtCookie != null) {
                jwt = jwtCookie.getValue();
            }
        }

        if (jwt == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
            }
        }

        if (jwt != null) {
            revokedTokenRepository.save(new RevokedToken(jwt));

            Cookie cookie = new Cookie("JWT", null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }

        return ResponseEntity.ok("Wylogowano pomyślnie.");
    }
}