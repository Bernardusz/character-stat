package io.github.bernardusz.character_stat.task;

import io.github.bernardusz.character_stat.task.dto.*;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "localhost:5173")
public class TaskController {
  private final TaskService taskService;
  public TaskController(TaskService taskService) {
    this.taskService = taskService;
  }
  
  @GetMapping("/{userId}/tasks")
  public ResponseEntity<List<TaskSummary>> findAllByProfileId(@PathVariable Long userId) {
    return ResponseEntity.ok(taskService.findAllByProfileId(userId));
  }

  @GetMapping("/{userId}/tasks/{id}")
  public ResponseEntity<TaskNote> findById(@PathVariable Long id) {
    return ResponseEntity.ok(taskService.findById(id));
  }

  @PostMapping("/{userId}/tasks")
  public ResponseEntity<Void> save(@PathVariable Long userId, @RequestBody TaskCreate task) {
    return taskService.save(userId, task).map(
      statusCode -> {
        URI location = ServletUriComponentsBuilder
          .fromCurrentRequest()
          .path("/{id}")
          .buildAndExpand(statusCode)
          .toUri();
        return ResponseEntity.created(location).<Void>build();
      }
    ).orElse(ResponseEntity.internalServerError().build());
  }

  @PutMapping("/{userId}/tasks/{id}")
  public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody TaskUpdate task) {
    taskService.update(id, task);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/{userId}/tasks")
  public ResponseEntity<Void> update(@RequestBody List<TaskStatusUpdate> task) {
    taskService.update(task);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{userId}/tasks/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    taskService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
