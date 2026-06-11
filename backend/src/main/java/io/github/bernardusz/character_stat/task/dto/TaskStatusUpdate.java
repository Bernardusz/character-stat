package io.github.bernardusz.character_stat.task.dto;

import io.github.bernardusz.character_stat.task.TaskStatus;
import io.github.bernardusz.character_stat.task.TaskUrgency;

import java.time.LocalDateTime;

public record TaskStatusUpdate(
  Long id,
  TaskStatus status,
  int position
) {}
