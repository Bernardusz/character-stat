package io.github.bernardusz.character_stat.note;

import io.github.bernardusz.character_stat.note.dto.NoteCreate;
import io.github.bernardusz.character_stat.note.dto.NoteSummary;
import io.github.bernardusz.character_stat.note.dto.NoteUpdate;
import io.github.bernardusz.character_stat.profile.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {
  private final NoteRepository noteRepository;
  public NoteService(NoteRepository noteRepository) {
    this.noteRepository = noteRepository;
  }

  @Transactional(readOnly = true)
  public List<NoteSummary> findAllByProfileId(Long userId) {
    return noteRepository.findAllByProfileId(userId);
  }

  @Transactional(readOnly = true)
  public Note findById(Long id) {
    return noteRepository
      .findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile doesn't exist"));
  }

  @Transactional
  public Optional<Long> save(Long userId, NoteCreate noteCreate){
    return noteRepository.save(userId, noteCreate);
  }

  @Transactional
  public void update(Long id, NoteUpdate noteUpdate) {
    noteRepository.update(id, noteUpdate);
  }

  @Transactional
  public void delete(Long id) {
    noteRepository.delete(id);
  }
}
