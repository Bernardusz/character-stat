package io.github.bernardusz.character_stat.note;

import io.github.bernardusz.character_stat.dashboard.dto.NoteInventoryTreeResponse;
import io.github.bernardusz.character_stat.note.dto.NoteCreate;
import io.github.bernardusz.character_stat.note.dto.NoteDetail;
import io.github.bernardusz.character_stat.note.dto.NoteSummary;
import io.github.bernardusz.character_stat.note.dto.NoteUpdate;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import io.github.bernardusz.character_stat.task.TaskStatus;
import io.github.bernardusz.character_stat.task.TaskUrgency;
import io.github.bernardusz.character_stat.task.dto.TaskSummary;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class NoteRepository {
  private final JdbcClient jdbcClient;
  public NoteRepository(JdbcClient jdbcClient) {
    this.jdbcClient = jdbcClient;
  }

  public List<NoteSummary> findAllByProfileId(Long userId) {
    return jdbcClient
        .sql("""
            SELECT id, user_id, title, category
            FROM notes
            WHERE user_id = :userId
            """)
        .param("userId", userId)
        .query(NoteSummary.class)
        .list();
  }

  public Optional<NoteDetail> findById(Long id){
    NoteDetail noteDetail = jdbcClient
      .sql("""
          SELECT
            n.id AS noteId,
            n.title AS noteTitle,
            n.content AS noteContent,
            n.category AS noteCategory,
            t.id AS taskId,
            t.title AS taskTitle,
            t.position AS taskPosition,
            t.urgency_tier AS taskUrgency,
            t.status AS taskStatus,
            t.created_at AS taskCreatedAt
          FROM notes n
          LEFT JOIN tasks t ON n.id = t.note_id
          WHERE n.id = :id
          """)
      .param("id", id)
      .query((ResultSet rs) -> {
          NoteDetail detail = null;
          while (rs.next()){
            if (detail == null) {
              detail = new NoteDetail(
                new NoteInventoryTreeResponse(
                  rs.getLong("noteId"),
                  rs.getString("noteTitle"),
                  NoteCategory.valueOf(rs.getString("noteCategory")),
                  new ArrayList<>()
                ),
                rs.getString("noteContent")
              );
            }

            Long taskId = rs.getLong("taskId");
            if (!rs.wasNull()) {
              TaskSummary taskSummary = new TaskSummary(
                taskId,
                rs.getLong("noteId"),
                rs.getString("noteTitle"),
                rs.getString("taskTitle"),
                rs.getInt("taskPosition"),
                TaskUrgency.valueOf(rs.getString("taskUrgency")),
                TaskStatus.valueOf(rs.getString("taskStatus")),
                rs.getTimestamp("taskCreatedAt").toLocalDateTime()
              );
              detail.noteSummary().tasks().add(taskSummary);
            }
        }
          return detail;
      });
    return Optional.of(noteDetail);
  }

  public Optional<Long> save(Long userId, NoteCreate noteCreate){
    return jdbcClient
      .sql("""
          INSERT INTO notes
          (user_id, title, content, category)
          VALUES (:user_id, :title, :content, :category)
          RETURNING id
          """)
      .param("user_id", userId)
      .param("title", noteCreate.title())
      .param("content", noteCreate.content())
      .param("category", noteCreate.category().name())
      .query(Long.class)
      .optional();
  }

  public void update (Long id, NoteUpdate noteUpdate){
    jdbcClient
      .sql("""
          UPDATE notes SET
          title = :title,
          content = :content,
          category = :category
          WHERE id = :id
          """)
      .param("title", noteUpdate.title())
      .param("content", noteUpdate.content())
      .param("category", noteUpdate.category().name())
      .param("id", id)
      .update();
  }

  public void delete (Long id){
    jdbcClient
      .sql("""
          DELETE FROM notes WHERE id = :id
      """)
      .param("id", id)
      .update();
  }

}
