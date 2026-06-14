package io.github.bernardusz.character_stat.dashboard;

import io.github.bernardusz.character_stat.dashboard.dto.CharacterStatsResponse;
import io.github.bernardusz.character_stat.dashboard.dto.DashboardData;
import io.github.bernardusz.character_stat.dashboard.dto.NoteInventoryTreeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:5173", exposedHeaders = "location")
@RequestMapping("/api/profiles")
public class DashboardController {
  private final DashboardService dashboardService;
  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping("/{userId}/dashboard")
  public ResponseEntity<DashboardData> getDashboard(@PathVariable Long userId) {
    return ResponseEntity.ok(dashboardService.getDashboardData(userId));
  }

  @GetMapping("/{userId}/stats")
  public ResponseEntity<CharacterStatsResponse> getStatsByProfileId(@PathVariable Long userId) {
    return ResponseEntity.ok(dashboardService.getStatsByProfileId(userId));
  }

  @GetMapping("/{userId}/notes-full")
  public ResponseEntity<List<NoteInventoryTreeResponse>> getFullNotesWithTassByProfileId(@PathVariable Long userId) {
    return ResponseEntity.ok(dashboardService.getFullNotesWithTassByProfileId(userId));
  }
}
