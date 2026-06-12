package io.github.bernardusz.character_stat.task.dto;

import io.github.bernardusz.character_stat.task.TaskStatus;
import io.github.bernardusz.character_stat.task.TaskUrgency;
import java.time.LocalDateTime;

public record TaskNote(
    Long id,
    String noteTitle,
    String title,
    String description,
    Integer position,
    TaskUrgency urgencyTier,
    TaskStatus status,
    LocalDateTime createdAt) {}
