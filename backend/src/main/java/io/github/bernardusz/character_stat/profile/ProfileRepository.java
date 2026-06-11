package io.github.bernardusz.character_stat.profile;

import io.github.bernardusz.character_stat.profile.dto.ProfileUsername;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProfileRepository {
  private final JdbcClient jdbcClient;
  public ProfileRepository(JdbcClient jdbcClient) {
    this.jdbcClient = jdbcClient;
  }

  public List<Profile> findAll() {
    return jdbcClient.sql("SELECT * FROM profiles").query(Profile.class).list();
  }

  public Optional<Profile> findById(Long id) {
    return jdbcClient.sql("SELECT * FROM profiles WHERE id = :id")
      .param("id", id).query(Profile.class).optional();
  }

  public Optional<Long> save(ProfileUsername profileUsername) {
    return jdbcClient.sql("INSERT INTO profiles (username) VALUES (:username) RETURNING id")
      .param("username", profileUsername.username()).query(Long.class).optional();
  }

  public void update(ProfileUsername profileUsername, Long id) {
    jdbcClient.sql("UPDATE profiles SET username = :username WHERE id = :id")
      .param("username", profileUsername.username())
      .param("id", id).update();
  }

  public void delete(Long id){
    jdbcClient.sql("DELETE FROM profiles WHERE id = :id")
      .param("id", id).update();
  }

}
