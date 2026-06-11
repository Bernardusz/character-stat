package io.github.bernardusz.character_stat.note.dto;

import io.github.bernardusz.character_stat.note.NoteCategory;

public record NoteCreate(
  Long userId,
  String title,
  String content,
  NoteCategory category
) {}
