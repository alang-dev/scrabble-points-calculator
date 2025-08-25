package com.scrabble.score.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScoreDTO {
  private UUID id;
  private String letters;
  private Integer points;
  private LocalDateTime createdAt;
}
