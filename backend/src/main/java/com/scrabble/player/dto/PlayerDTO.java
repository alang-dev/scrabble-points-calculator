package com.scrabble.player.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlayerDTO {
  private String playerId;
  private String playerName;
}
