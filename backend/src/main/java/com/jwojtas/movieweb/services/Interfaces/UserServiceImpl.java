package com.jwojtas.movieweb.services.Interfaces;

import com.jwojtas.movieweb.entities.User;

import java.util.List;

public interface UserServiceImpl {

    public List<User> getAllUsers();
    public User getUserById(Long id);
    public User createUser(User user);
    public User updateUser(Long id, User updatedData);
    public void deleteUser(Long id);
    public User getUserByUsername(String username);
}
