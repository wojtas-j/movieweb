package com.jwojtas.movieweb.service;

import com.jwojtas.movieweb.entities.User;
import com.jwojtas.movieweb.exceptions.UserAlreadyExistsException;
import com.jwojtas.movieweb.exceptions.UserNotFoundException;
import com.jwojtas.movieweb.repositories.UserRepository;
import com.jwojtas.movieweb.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void shouldCreateUserSuccessfully() {
        User user = new User();
        user.setUsername("testUser");
        user.setEmail("test@example.com");
        user.setPassword("password123");

        when(userRepository.existsByUsername(user.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User createdUser = userService.createUser(user);

        assertNotNull(createdUser);
        verify(userRepository).save(user);
        verify(passwordEncoder).encode("password123");
    }

    @Test
    public void shouldThrowExceptionWhenUsernameExists() {
        User user = new User();
        user.setUsername("existingUser");
        user.setEmail("test@example.com");

        when(userRepository.existsByUsername(user.getUsername())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(user));
    }

    @Test
    public void shouldThrowExceptionWhenEmailExists() {
        User user = new User();
        user.setUsername("newUser");
        user.setEmail("existing@example.com");

        when(userRepository.existsByEmail(user.getEmail())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(user));
    }

    @Test
    public void shouldReturnAllUsers() {
        User user1 = new User();
        User user2 = new User();
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        var users = userService.getAllUsers();

        assertEquals(2, users.size());
        verify(userRepository).findAll();
    }

    @Test
    public void shouldReturnUserById() {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    public void shouldThrowExceptionWhenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserById(1L));
    }

    @Test
    public void shouldUpdateUserSuccessfully() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("oldUsername");
        existingUser.setEmail("oldEmail@example.com");
        existingUser.setFirstName("OldFirstName");
        existingUser.setLastName("OldLastName");
        existingUser.setPhoneNumber("123456789");
        existingUser.setAdmin(false);
        existingUser.setPassword("oldPassword");

        User updatedData = new User();
        updatedData.setUsername("newUsername");
        updatedData.setEmail("newEmail@example.com");
        updatedData.setFirstName("NewFirstName");
        updatedData.setLastName("NewLastName");
        updatedData.setPhoneNumber("987654321");
        updatedData.setAdmin(true);
        updatedData.setPassword("newPassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByUsername("newUsername")).thenReturn(false);
        when(userRepository.existsByEmail("newEmail@example.com")).thenReturn(false);
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(existingUser)).thenReturn(existingUser);

        User updatedUser = userService.updateUser(1L, updatedData);

        assertEquals("newUsername", updatedUser.getUsername());
        assertEquals("newEmail@example.com", updatedUser.getEmail());
        assertEquals("NewFirstName", updatedUser.getFirstName());
        assertEquals("NewLastName", updatedUser.getLastName());
        assertEquals("987654321", updatedUser.getPhoneNumber());
        assertTrue(updatedUser.isAdmin());
        assertEquals("encodedNewPassword", updatedUser.getPassword());

        verify(userRepository).save(existingUser);
    }


    @Test
    public void shouldDeleteUserSuccessfully() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    public void shouldThrowExceptionWhenDeletingNonExistingUser() {
        when(userRepository.existsById(1L)).thenReturn(false);

        assertThrows(UserNotFoundException.class, () -> userService.deleteUser(1L));
    }
}
