package com.scrabble.score.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScoringRuleDTO {
  private Integer points;
  private String letters;
}