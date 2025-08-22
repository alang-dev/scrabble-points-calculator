package com.scrabble.score.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScoreDTO {
  private String scoreId;
  private String playerId;
  private String playerName;
  private String sessionId;
  private String letters;
  private Integer points;
  private String createdAt;
}
