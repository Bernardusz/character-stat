package io.github.bernardusz.character_stat.note.dto;

import io.github.bernardusz.character_stat.dashboard.dto.NoteInventoryTreeResponse;

public record NoteDetail(
  NoteInventoryTreeResponse noteSummary,
  String content
) {
}
