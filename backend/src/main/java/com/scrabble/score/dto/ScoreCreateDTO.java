package com.scrabble.score.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScoreCreateDTO {
  private String letters;
}
