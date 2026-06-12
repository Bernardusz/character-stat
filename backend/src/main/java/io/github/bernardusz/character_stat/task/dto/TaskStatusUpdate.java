package io.github.bernardusz.character_stat.task.dto;

import io.github.bernardusz.character_stat.task.TaskStatus;

public record TaskStatusUpdate(Long id, TaskStatus status, int position) {}
