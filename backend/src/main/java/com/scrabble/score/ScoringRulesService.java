package com.scrabble.score;

import com.scrabble.score.dto.ScoringRuleDTO;
import java.util.List;

public interface ScoringRulesService {
  List<ScoringRuleDTO> getScoringRules();
  
  int computeScore(String letters);
}