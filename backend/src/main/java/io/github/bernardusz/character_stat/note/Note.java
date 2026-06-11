package io.github.bernardusz.character_stat.note;

public record Note(
  Long id,
  Long userId,
  String title,
  String content,
  NoteCategory category
){}
