package com.scrabble.gamesession.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GameSessionDTO {
  private String sessionId;
  private String playerId;
  private String playerName;
}
