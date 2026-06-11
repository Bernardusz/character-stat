package io.github.bernardusz.character_stat.profile;

import io.github.bernardusz.character_stat.profile.dto.ProfileUsername;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "localhost:5173")
public class ProfileController {
  private final ProfileService profileService;
  public ProfileController(ProfileService profileService) {
    this.profileService = profileService;
  }

  @GetMapping
  public ResponseEntity<List<Profile>> findAll() {
    return ResponseEntity.ok(profileService.findAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Profile> findById(@PathVariable Long id) {
    return ResponseEntity.ok(profileService.findById(id));
  }

  @PostMapping
  public ResponseEntity<Void> save(@RequestBody ProfileUsername profileUsername) {
    return profileService.save(profileUsername)
      .map(status -> {
        URI location = ServletUriComponentsBuilder
          .fromCurrentRequest()
          .path("/{id}")
          .buildAndExpand(status)
          .toUri();
        return ResponseEntity.created(location).<Void>build();
      })
      .orElse(ResponseEntity.internalServerError().build());
  }

  @PutMapping("/{id}")
  public  ResponseEntity<Void> update(@PathVariable Long id, @RequestBody ProfileUsername profileUsername) {
    profileService.update(profileUsername, id);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{id}")
  public  ResponseEntity<Void> delete(@PathVariable Long id) {
    profileService.delete(id);
    return ResponseEntity.noContent().build();
  }

}
