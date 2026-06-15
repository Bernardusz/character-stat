package io.github.bernardusz.character_stat.note;

import io.github.bernardusz.character_stat.note.dto.NoteCreate;
import io.github.bernardusz.character_stat.note.dto.NoteDetail;
import io.github.bernardusz.character_stat.note.dto.NoteSummary;
import io.github.bernardusz.character_stat.note.dto.NoteUpdate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Controller
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:5173", exposedHeaders = "location")
public class NoteController {
  private final NoteService noteService;

  public NoteController(NoteService noteService) {
    this.noteService = noteService;
  }

  @GetMapping("/{userId}/notes")
  public ResponseEntity<List<NoteSummary>> findAllByProfileId(@PathVariable Long userId) {
    return ResponseEntity.ok(noteService.findAllByProfileId(userId));
  }

  @GetMapping("/{userId}/notes/{id}")
  public ResponseEntity<NoteDetail> findById(@PathVariable Long id) {
    return ResponseEntity.ok(noteService.findById(id));
  }

  @PostMapping("/{userId}/notes")
  public ResponseEntity<Void> save(@PathVariable Long userId, @RequestBody NoteCreate noteCreate) {
    return noteService
        .save(userId, noteCreate)
        .map(
            id -> {
              URI uri =
                  ServletUriComponentsBuilder.fromCurrentRequest()
                      .path("/{id}")
                      .buildAndExpand(id)
                      .toUri();
              return ResponseEntity.created(uri).<Void>build();
            })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PutMapping("/{userId}/notes/{id}")
  public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody NoteUpdate noteUpdate) {
    noteService.update(id, noteUpdate);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{userId}/notes/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    noteService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
