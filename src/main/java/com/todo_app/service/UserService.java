package com.todo_app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo_app.dto.UserDTO;
import com.todo_app.model.User;
import com.todo_app.repository.UserRepository;

@Service
public class UserService {
   @Autowired
    private UserRepository userRepository;

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        return userRepository.save(user);
    }

    public boolean authenticate(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        return optionalUser.map(user -> user.getPassword().equals(password)).orElse(false);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Save User to the database
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Get all Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
