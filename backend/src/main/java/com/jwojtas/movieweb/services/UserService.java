package com.jwojtas.movieweb.services;

import com.jwojtas.movieweb.entities.User;
import com.jwojtas.movieweb.repositories.UserRepository;
import com.jwojtas.movieweb.services.Interfaces.UserServiceImpl;
import com.jwojtas.movieweb.exceptions.UserAlreadyExistsException;
import com.jwojtas.movieweb.exceptions.UserNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService implements UserServiceImpl{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Taki użytkownik nie istnieje"));
    }

    @Override
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("Użytkownik o takiej nazwie już istnieje");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Użytkownik z takim emailem już istnieje");
        }

        String rawPassword = user.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User updatedData) {
        User existing = userRepository.findById(id).orElse(null);
        if (existing == null) {
            throw new UserNotFoundException("Użytkownik o ID " + id + " nie istnieje");
        }

        if (!existing.getUsername().equals(updatedData.getUsername())) {
            if (userRepository.existsByUsername(updatedData.getUsername())) {
                throw new UserAlreadyExistsException("Użytkownik o takiej nazwie już istnieje");
            }
            existing.setUsername(updatedData.getUsername());
        }

        if (!existing.getEmail().equals(updatedData.getEmail())) {
            if (userRepository.existsByEmail(updatedData.getEmail())) {
                throw new UserAlreadyExistsException("Użytkownik z takim emailem już istnieje");
            }
            existing.setEmail(updatedData.getEmail());
        }

        existing.setFirstName(updatedData.getFirstName());
        existing.setLastName(updatedData.getLastName());
        existing.setPhoneNumber(updatedData.getPhoneNumber());

        existing.setAdmin(updatedData.isAdmin());

        if (updatedData.getPassword() != null && !updatedData.getPassword().isBlank()) {
            String newEncodedPassword = passwordEncoder.encode(updatedData.getPassword());
            existing.setPassword(newEncodedPassword);
        }

        return userRepository.save(existing);
    }

    @Override
    public void deleteUser(Long id) {
        boolean exists = userRepository.existsById(id);
        if (!exists) {
            throw new UserNotFoundException("Użytkownik o ID " + id + " nie istnieje");
        }
        userRepository.deleteById(id);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}
