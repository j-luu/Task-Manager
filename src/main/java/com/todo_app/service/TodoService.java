package com.todo_app.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todo_app.dto.TodoDTO;
import com.todo_app.model.Todo;
import com.todo_app.model.User;
import com.todo_app.repository.TodoRepository;


@Service
public class TodoService {
   @Autowired
    private TodoRepository todoRepository;

    public Todo addTodo(User user, TodoDTO todoDTO) {
        Todo todo = new Todo();
        todo.setUser(user);
        todo.setTitle(todoDTO.getTitle());
        todo.setDescription(todoDTO.getDescription());
        todo.setDueDateTime(todoDTO.getDueDateTime());
        todo.setIsDone(todoDTO.getIsDone() != null ? todoDTO.getIsDone() : false);
        return todoRepository.save(todo);
    }

    public List<Todo> getTodosByUserAndDate(User user, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return todoRepository.findByUserAndDueDateTimeBetween(user, startOfDay, endOfDay);
    }


    public List<Todo> getAllTodosForUser(User user) {
        return todoRepository.findByUser(user);
    }

    public void updateTodo(Todo todo) {
        todoRepository.save(todo);
    }

    public Todo saveTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

}
