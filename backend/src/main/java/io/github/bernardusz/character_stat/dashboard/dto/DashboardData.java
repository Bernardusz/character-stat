package io.github.bernardusz.character_stat.dashboard.dto;

import io.github.bernardusz.character_stat.task.dto.TaskWithoutNote;

import java.util.List;

public record DashboardData(
  CharacterStatsResponse characterStats,
  List<NoteInventoryTreeResponse> notes,
  List<TaskWithoutNote> inboxTasks
) {}
