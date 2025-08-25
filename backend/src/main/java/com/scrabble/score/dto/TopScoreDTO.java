package com.scrabble.score.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopScoreDTO {
  private UUID id;
  private Integer rank;
  private Integer score;
  private String letters;
  private LocalDateTime createdAt;
}
