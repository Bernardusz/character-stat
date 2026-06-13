package io.github.bernardusz.character_stat.dashboard.dto;

public record CharacterStatsResponse(
    int energyScore, int healthScore, double completionRate, long totalActiveTasks) {}
