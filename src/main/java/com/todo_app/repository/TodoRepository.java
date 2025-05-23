package com.todo_app.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.todo_app.model.Todo;
import com.todo_app.model.User;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUser(User user);
    List<Todo> findByUserAndDueDateTimeBetween(User user, LocalDateTime start, LocalDateTime end);
}

