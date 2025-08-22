package com.scrabble.score;

import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRulesDTO;

public interface ScoreService {
  ScoringRulesDTO getScoringRules();
  
  ScoreDTO computeScore(ScoreComputeDTO request);
  
  ScoreDTO create(ScoreCreateDTO request);
}