package io.github.bernardusz.character_stat.task;

import java.time.LocalDateTime;

public record Task(
  Long id,
  Long noteId,
  Long userId,
  String title,
  String description,
  Integer position,
  TaskUrgency urgencyTier,
  TaskStatus status,
  LocalDateTime createdAt
){}
