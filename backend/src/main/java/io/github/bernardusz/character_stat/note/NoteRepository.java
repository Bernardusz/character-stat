package io.github.bernardusz.character_stat.note;

import io.github.bernardusz.character_stat.note.dto.NoteCreate;
import io.github.bernardusz.character_stat.note.dto.NoteSummary;
import io.github.bernardusz.character_stat.note.dto.NoteUpdate;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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

  public Optional<Note> findById(Long id){
    return jdbcClient
      .sql("""
          SELECT *
          FROM notes
          WHERE id = :id
          """)
      .param("id", id)
      .query(Note.class)
      .optional();
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
