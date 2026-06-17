package io.github.bernardusz.character_stat.task;

import io.github.bernardusz.character_stat.task.dto.*;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class TaskRepository {
  private final JdbcClient jdbcClient;
  private final JdbcTemplate jdbcTemplate;
  public TaskRepository(JdbcClient jdbcClient, JdbcTemplate jdbcTemplate) {
    this.jdbcClient = jdbcClient;
    this.jdbcTemplate = jdbcTemplate;
  }

  public List<TaskSummary> findAllByProfileId(Long userId) {
    return jdbcClient
      .sql(
        """
        SELECT
          t.id,
          t.note_id AS noteId,
          n.title AS noteTitle,
          t.title,
          t.position,
          t.urgency_tier AS urgencyTier,
          t.status,
          t.created_at AS createdAt
        FROM tasks t
        LEFT JOIN notes n ON t.note_id = n.id
        WHERE t.user_id = :userId
        ORDER BY t.position ASC;
        """
      )
      .param("userId", userId)
      .query(TaskSummary.class)
      .list();
  }

  public Optional<TaskNote> findById(Long id){
    return jdbcClient
      .sql("""
           SELECT
            t.id,
            t.note_id,
            n.title AS note_title,
            t.title,
            t.description,
            t.position,
            t.urgency_tier,
            t.status,
            t.created_at
           FROM tasks t
           LEFT JOIN notes n on t.note_id = n.id
           WHERE t.id = :taskId
           """)
      .param("taskId", id)
      .query(TaskNote.class)
      .optional();
  }

  public Optional<Long> save(Long userId, TaskCreate taskCreate, Long position){
    return jdbcClient
      .sql("""
           INSERT INTO tasks
           (note_id, user_id, title, description, position, urgency_tier, status)
           VALUES (:noteId, :userId, :title, :description, :position, :urgencyTier, :status)
           RETURNING id
           """)
      .param("noteId", taskCreate.noteId())
      .param("userId", userId)
      .param("title", taskCreate.title())
      .param("description", taskCreate.description())
      .param("position", position)
      .param("urgencyTier", taskCreate.urgencyTier().name())
      .param("status", taskCreate.status().name())
      .query(Long.class)
      .optional();
  }

  public void update(Long id, TaskUpdate task){
    jdbcClient.sql(
      """
      UPDATE tasks SET
        title = :title,
        description = :description,
        urgency_tier = :urgencyTier,
        status = :status
      WHERE id = :id
      """
    )
    .param("title", task.title())
    .param("description", task.description())
    .param("urgencyTier", task.urgencyTier().name())
    .param("status", task.status().name())
    .param("id", id)
    .update();
  }

  public void update(List<TaskStatusUpdate> tasks){
    String sql = "UPDATE tasks SET status = ?, position = ? WHERE id = ?";

    jdbcTemplate.batchUpdate(sql, tasks, tasks.size(),
      (preparedStatement, argument) -> {
        preparedStatement.setString(1, argument.status().name());
        preparedStatement.setInt(2, argument.position());
        preparedStatement.setLong(3, argument.id());
      }
    );
  }

  public void delete(Long id){
    jdbcClient.sql(
      "DELETE FROM tasks WHERE id = :id")
    .param("id", id)
    .update();
  }

  public List<TaskWithoutNote> fetchAllInboxTasksByProfileId(Long userId){
    return jdbcClient.sql(
      """
      SELECT
          id,
          note_id AS noteId,
          title,
          position,
          urgency_tier AS urgencyTier,
          status,
          created_at AS createdAt
        FROM tasks
        WHERE user_id = :userId AND note_id IS NULL
        ORDER BY position ASC;
      """
    ).param("userId", userId).query(TaskWithoutNote.class).list();
  }

  public Long getTodoCount(){
    return jdbcClient.sql("SELECT COUNT(*) FROM tasks WHERE status = 'TODO'").query(Long.class).single();
  }

}
