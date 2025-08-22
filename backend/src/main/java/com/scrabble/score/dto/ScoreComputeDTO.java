package com.scrabble.score.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreComputeDTO {

  @NotBlank(message = "Session ID is required")
  private String sessionId;

  @NotBlank(message = "Player ID is required")
  private String playerId;

  @NotBlank(message = "Letters are required")
  private String letters;
}
