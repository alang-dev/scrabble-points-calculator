package com.scrabble.score;

import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRuleDTO;
import com.scrabble.score.dto.TopScoreDTO;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ScoreServiceImpl implements ScoreService {

  private final ScoreRepository scoreRepository;
  private final ScoringRulesService scoringRulesService;

  public ScoreServiceImpl(ScoreRepository scoreRepository, ScoringRulesService scoringRulesService) {
    this.scoreRepository = scoreRepository;
    this.scoringRulesService = scoringRulesService;
  }

  @Override
  public List<ScoringRuleDTO> getScoringRules() {
    return scoringRulesService.getScoringRules();
  }

  @Override
  public ScoreComputeDTO computeScore(ScoreCreateDTO request) {
    int totalScore = scoringRulesService.computeScore(request.getLetters());
    return ScoreComputeDTO.builder().letters(request.getLetters()).score(totalScore).build();
  }

  @Override
  public ScoreDTO create(ScoreCreateDTO request) {
    int totalScore = scoringRulesService.computeScore(request.getLetters());

    Score score =
        Score.builder().letters(request.getLetters().toUpperCase()).points(totalScore).build();

    Score savedScore = scoreRepository.save(score);

    return ScoreDTO.builder()
        .id(savedScore.getId())
        .letters(savedScore.getLetters())
        .points(savedScore.getPoints())
        .createdAt(savedScore.getCreatedAt())
        .build();
  }

  @Override
  public List<TopScoreDTO> findTopScores(Pageable pageable) {
    List<Score> topScores = scoreRepository.findAll(pageable).getContent();

    AtomicInteger rank = new AtomicInteger(1);
    return topScores.stream()
        .map(
            score ->
                TopScoreDTO.builder()
                    .rank(rank.getAndIncrement())
                    .score(score.getPoints())
                    .letters(score.getLetters())
                    .build())
        .collect(Collectors.toList());
  }

  @Override
  public void delete(UUID id) {
    scoreRepository.deleteById(id);
  }
}
