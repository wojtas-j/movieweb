package com.jwojtas.movieweb.controllers;

import com.jwojtas.movieweb.entities.User;
import com.jwojtas.movieweb.services.Interfaces.UserServiceImpl;
import com.jwojtas.movieweb.dto.CreateUserRequest;
import com.jwojtas.movieweb.dto.UserDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class UserController {

    private final UserServiceImpl userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserRequest request) {
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPhoneNumber(request.phoneNumber());
        user.setPassword(request.password());
        user.setAdmin(request.isAdmin());

        User created = userService.createUser(user);

        UserDto dto = new UserDto(
                created.getId(),
                created.getFirstName(),
                created.getLastName(),
                created.getUsername(),
                created.getEmail(),
                created.getPhoneNumber(),
                created.isAdmin()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedData) {

        User updated = userService.updateUser(id, updatedData);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
