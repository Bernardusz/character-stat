package io.github.bernardusz.character_stat.dashboard;

import io.github.bernardusz.character_stat.dashboard.dto.CharacterStatsResponse;
import io.github.bernardusz.character_stat.dashboard.dto.DashboardData;
import io.github.bernardusz.character_stat.dashboard.dto.NoteInventoryTreeResponse;
import io.github.bernardusz.character_stat.task.TaskRepository;
import io.github.bernardusz.character_stat.task.dto.TaskSummary;
import io.github.bernardusz.character_stat.task.dto.TaskWithoutNote;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DashboardService {
  private final DashboardRepository dashboardRepository;
  private final TaskRepository taskRepository;
  public DashboardService(DashboardRepository dashboardRepository, TaskRepository taskRepository) {
    this.dashboardRepository = dashboardRepository;
    this.taskRepository = taskRepository;
  }

  @Transactional(readOnly = true)
  public CharacterStatsResponse getStatsByProfileId(Long userId) {
    return dashboardRepository.getStatsByProfileId(userId);
  }

  @Transactional(readOnly = true)
  public List<NoteInventoryTreeResponse> getFullNotesWithTassByProfileId(Long userId){
    return dashboardRepository.getFullNotesWithTassByProfileId(userId);
  }

  @Transactional(readOnly = true)
  public DashboardData getDashboardData(Long userId){
    CharacterStatsResponse stats = dashboardRepository.getStatsByProfileId(userId);
    List<NoteInventoryTreeResponse> inventory = dashboardRepository.getFullNotesWithTassByProfileId(userId);
    List<TaskWithoutNote> inboxTasks = taskRepository.fetchAllInboxTasksByProfileId(userId);
    return new DashboardData(stats, inventory, inboxTasks);
  }

}
