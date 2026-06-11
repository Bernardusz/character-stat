package io.github.bernardusz.character_stat.dashboard.dto;

import io.github.bernardusz.character_stat.task.dto.TaskSummary;
import java.util.List;

public record NoteInventoryTreeResponse(
  Long id,
  String title,
  String category,
  String briefContent,
  List<TaskSummary> tasks
) {}
