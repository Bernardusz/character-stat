package io.github.bernardusz.character_stat.note.dto;

import io.github.bernardusz.character_stat.note.NoteCategory;

public record NoteSummary(Long id, String title, NoteCategory category) {}
