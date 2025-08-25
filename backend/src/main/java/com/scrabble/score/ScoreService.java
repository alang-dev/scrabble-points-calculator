package com.scrabble.score;

import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRuleDTO;
import com.scrabble.score.dto.TopScoreDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface ScoreService {
  List<ScoringRuleDTO> getScoringRules();

  ScoreComputeDTO computeScore(ScoreCreateDTO request);

  ScoreDTO create(ScoreCreateDTO request);

  List<TopScoreDTO> findTopScores(Pageable pageable);

  void deleteByIds(List<UUID> ids);
}
