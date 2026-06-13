package io.github.bernardusz.character_stat.dashboard;

import io.github.bernardusz.character_stat.dashboard.dto.CharacterStatsResponse;
import io.github.bernardusz.character_stat.dashboard.dto.NoteInventoryTreeResponse;
import io.github.bernardusz.character_stat.note.NoteCategory;
import io.github.bernardusz.character_stat.task.TaskStatus;
import io.github.bernardusz.character_stat.task.TaskUrgency;
import io.github.bernardusz.character_stat.task.dto.TaskSummary;
import java.sql.ResultSet;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardRepository {
  private final JdbcClient jdbcClient;
  private final JdbcTemplate jdbcTemplate;

  public DashboardRepository(JdbcClient jdbcClient, JdbcTemplate jdbcTemplate) {
    this.jdbcClient = jdbcClient;
    this.jdbcTemplate = jdbcTemplate;
  }

  public List<NoteInventoryTreeResponse> getFullNotesWithTassByProfileId(Long userId) {
    String sql =
        """
      SELECT
        n.id AS noteId,
        n.title AS noteTitle,
        n.category AS noteCategory,
        t.id AS taskId,
        t.title AS taskTitle,
        t.position AS taskPosition,
        t.urgency_tier AS taskUrgencyTier,
        t.status AS taskStatus,
        t.created_at AS taskCreatedAt
      FROM notes n
      LEFT JOIN tasks t ON n.id = t.note_id
      WHERE n.user_id = :userId
      ORDER BY n.category DESC, t.position ASC;
      """;
    return jdbcClient
        .sql(sql)
        .param("userId", userId)
        .query(
            (ResultSet rs) -> {
              Map<Long, NoteInventoryTreeResponse> noteMap = new LinkedHashMap<>();

              while (rs.next()) {
                Long noteId = rs.getLong("noteId");
                NoteInventoryTreeResponse noteResponse =
                    noteMap.computeIfAbsent(
                        noteId,
                        id -> {
                          try {
                            return new NoteInventoryTreeResponse(
                                id,
                                rs.getString("noteTitle"),
                                NoteCategory.valueOf(rs.getString("noteCategory")),
                                new ArrayList<>());
                          } catch (Exception e) {
                            throw new RuntimeException("Error parsing note data", e);
                          }
                        });

                Long taskId = rs.getLong("taskId");

                if (!rs.wasNull()) {
                  TaskSummary task =
                      new TaskSummary(
                          taskId,
                          noteId,
                          rs.getString("noteTitle"),
                          rs.getString("taskTitle"),
                          rs.getInt("taskPosition"),
                          TaskUrgency.valueOf(rs.getString("taskUrgencyTier")),
                          TaskStatus.valueOf(rs.getString("taskStatus")),
                          rs.getTimestamp("taskCreatedAt").toLocalDateTime());
                  noteResponse.tasks().add(task);
                }
              }
              return new ArrayList<>(noteMap.values());
            });
  }

  public CharacterStatsResponse getStatsByProfileId(Long userId){
    String sql = """
      SELECT
        GREATEST(0, LEAST(100, ROUND(100 - COALESCE(SUM(
          CASE
            WHEN status != 'DONE' AND urgency_tier = 'IMPACTFUL' THEN 25
            WHEN status != 'DONE' AND urgency_tier = 'IMPORTANT' THEN 20
            WHEN status != 'DONE' AND urgency_tier = 'HEAVY' THEN 15
            WHEN status != 'DONE' AND urgency_tier = 'MEDIUM' THEN 10            
            WHEN status != 'DONE' AND urgency_tier = 'LIGHT' THEN 5
            ELSE 0
          END
        ), 0)))) AS energy_score,
        
         GREATEST(0, LEAST(100, ROUND(100 - COALESCE(SUM(
           CASE
              WHEN status != 'DONE' AND urgency_tier = 'IMPACTFUL' THEN 20
              WHEN status != 'DONE' AND urgency_tier = 'IMPORTANT' THEN 15
              WHEN status != 'DONE' AND urgency_tier = 'HEAVY' THEN 10
              WHEN status != 'DONE' AND urgency_tier = 'MEDIUM' THEN 5        
              WHEN status != 'DONE' AND urgency_tier = 'LIGHT' THEN 2
              ELSE 0
           END
        ), 0)))) AS health_score,
        
        ROUND(COALESCE(
          (COUNT(CASE WHEN status = 'DONE' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)),
          100.0
        ), 1) AS completion_rate,
        
        COUNT(CASE WHEN status != 'DONE' THEN 1 END) AS total_active_tasks
      FROM tasks
      WHERE user_id = :userId;
    """;

    return jdbcClient.sql(sql)
      .param("userId", userId)
      .query(CharacterStatsResponse.class)
      .single();
  }
}
