package io.github.bernardusz.character_stat.task;

import io.github.bernardusz.character_stat.task.dto.*;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TaskService {
  private final  TaskRepository taskRepository;
  public TaskService(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  @Transactional(readOnly = true)
  public List<TaskSummary> findAllByProfileId(Long userId) {
    return taskRepository.findAllByProfileId(userId);
  }

  @Transactional(readOnly = true)
  public TaskNote findById(Long id) {
    return taskRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
  }

  @Transactional
  public Optional<Long> save(Long userId, TaskCreate taskCreate) {
    return taskRepository.save(userId, taskCreate);
  }

  @Transactional
  public void update(Long id, TaskUpdate taskUpdate){
    taskRepository.update(id, taskUpdate);
  }

  @Transactional
  public void update(List<TaskStatusUpdate> tasks){
    taskRepository.update(tasks);
  }

  @Transactional
  public void delete(Long id) {
    taskRepository.delete(id);
  }
}
