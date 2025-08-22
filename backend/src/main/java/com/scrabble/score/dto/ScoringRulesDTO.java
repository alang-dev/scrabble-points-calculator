package com.scrabble.score.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScoringRulesDTO {
  private Map<Integer, List<String>> scoreGroups;
}
