package com.scrabble.score.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopScoreDTO {
  private Integer rank;
  private Integer score;
  private String letters;
}
