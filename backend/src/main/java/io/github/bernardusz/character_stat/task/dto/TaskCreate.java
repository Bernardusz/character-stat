package io.github.bernardusz.character_stat.task.dto;

import io.github.bernardusz.character_stat.task.TaskStatus;
import io.github.bernardusz.character_stat.task.TaskUrgency;

public record TaskCreate(
    Long noteId,
    String title,
    String description,
    TaskUrgency urgencyTier,
    TaskStatus status) {}
