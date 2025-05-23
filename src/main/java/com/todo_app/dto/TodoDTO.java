package com.todo_app.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TodoDTO {
    private String title;
    private String description;
    private LocalDateTime dueDateTime;
    private Boolean isDone;

}
