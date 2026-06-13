package io.github.bernardusz.character_stat.dashboard.dto;

import io.github.bernardusz.character_stat.note.NoteCategory;
import io.github.bernardusz.character_stat.task.dto.TaskSummary;
import java.util.List;

public record NoteInventoryTreeResponse(
    Long id, String title, NoteCategory category, List<TaskSummary> tasks) {}
