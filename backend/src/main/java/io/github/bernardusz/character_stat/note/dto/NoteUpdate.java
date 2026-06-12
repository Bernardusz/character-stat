package io.github.bernardusz.character_stat.note.dto;

import io.github.bernardusz.character_stat.note.NoteCategory;

public record NoteUpdate(String title, String content, NoteCategory category) {}
