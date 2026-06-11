package io.github.bernardusz.character_stat.profile;

import io.github.bernardusz.character_stat.profile.dto.ProfileUsername;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {
  private final ProfileRepository profileRepository;
  public ProfileService(ProfileRepository profileRepository) {
    this.profileRepository = profileRepository;
  }

  @Transactional(readOnly = true)
  public List<Profile> findAll() {
    return profileRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Profile findById(Long id) {
    return profileRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile doesn't exist"));
  }

  @Transactional
  public Optional<Long> save(ProfileUsername profileUsername) {
    return profileRepository.save(profileUsername);
  }

  @Transactional
  public void update(ProfileUsername profileUsername, Long id) {
    profileRepository.update(profileUsername, id);
  }

  @Transactional
  public void delete(Long id) {
    profileRepository.delete(id);
  }

}
