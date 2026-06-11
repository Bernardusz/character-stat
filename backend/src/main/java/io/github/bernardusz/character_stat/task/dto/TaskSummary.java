package io.github.bernardusz.character_stat.task.dto;

import io.github.bernardusz.character_stat.task.TaskStatus;
import io.github.bernardusz.character_stat.task.TaskUrgency;

import java.time.LocalDateTime;

public record TaskSummary(
  Long id,
  Long noteId,
  Long userId,
  String title,
  Integer position,
  TaskUrgency urgencyTier,
  TaskStatus status,
  LocalDateTime createdAt
) {}
