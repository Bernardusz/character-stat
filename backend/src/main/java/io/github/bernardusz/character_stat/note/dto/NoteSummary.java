package io.github.bernardusz.character_stat.note.dto;

public record NoteSummary(
  Long id,
  String title,
  String content,
  String category
) {}
