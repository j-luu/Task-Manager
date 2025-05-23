package com.todo_app.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todo_app.dto.TodoDTO;
import com.todo_app.model.Todo;
import com.todo_app.model.User;
import com.todo_app.repository.TodoRepository;
import com.todo_app.service.TodoService;
import com.todo_app.service.UserService;


@RestController
@RequestMapping("/api")
public class TodoController {

    private final TodoRepository todoRepository;

    @Autowired
    private TodoService todoService;

    @Autowired
    private UserService userService;

    TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @PatchMapping("/todos/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        if (updates.containsKey("title")) {
            todo.setTitle((String) updates.get("title"));
        }
        if (updates.containsKey("description")) {
            todo.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("dueDateTime")) {
            String dateTimeStr = (String) updates.get("dueDateTime");
            try {
                LocalDateTime parsed = LocalDateTime.parse(dateTimeStr);
                todo.setDueDateTime(parsed);
            } catch (DateTimeParseException e) {
                System.err.println("Failed to parse dueDateTime: " + dateTimeStr);
                e.printStackTrace();
            }
        }
        if (updates.containsKey("isDone")) {
            todo.setIsDone((Boolean) updates.get("isDone"));
        }

        todoRepository.save(todo);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        if (!todoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        todoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/todos/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        return todoRepository.findById(id)
            .map((todo) -> {
                todo.setTitle(updatedTodo.getTitle());
                todo.setDescription(updatedTodo.getDescription());
                todo.setDueDateTime(updatedTodo.getDueDateTime());
                todo.setIsDone(updatedTodo.getIsDone());
                Todo saved = todoRepository.save(todo);
                return ResponseEntity.ok(saved);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users/{username}/todos")
    public ResponseEntity<?> addTodo(@PathVariable String username, @RequestBody TodoDTO todoDTO) {
        User user = userService.findByUsername(username).orElse(null);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        Todo todo = todoService.addTodo(user, todoDTO);
        return ResponseEntity.ok(todo);
    }

    @GetMapping("/users/{username}/todos/{date}")
    public ResponseEntity<?> getTodosByDate(@PathVariable String username, @PathVariable String date) {
        User user = userService.findByUsername(username).orElse(null);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        LocalDate parsedDate = LocalDate.parse(date);
        List<Todo> todos = todoService.getTodosByUserAndDate(user, parsedDate);

        return ResponseEntity.ok(todos);
    }

    @GetMapping("/users/{username}/todos")
    public ResponseEntity<?> getAllTodos(@PathVariable String username) {
        User user = userService.findByUsername(username).orElse(null);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        return ResponseEntity.ok(todoService.getAllTodosForUser(user));
    }

    @PostMapping("/todos")  // Optional: for admin or dev use only
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        return ResponseEntity.ok(todoService.saveTodo(todo));
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Todo>> getAllTodos() {
        return ResponseEntity.ok(todoService.getAllTodos());
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}

