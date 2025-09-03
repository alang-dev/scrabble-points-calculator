package com.scrabble.score;

import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRuleDTO;
import com.scrabble.score.dto.TopScoreDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ScoreServiceImpl implements ScoreService {
  private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("points", "createdAt");
  private static final int MAX_PAGE_SIZE = 100;

  private final ScoreRepository scoreRepository;
  private final ScoringRulesService scoringRulesService;

  public ScoreServiceImpl(
      ScoreRepository scoreRepository, ScoringRulesService scoringRulesService) {
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

    log.info("Computed score {} for letters: {}", totalScore, request.getLetters());

    return ScoreComputeDTO.builder().letters(request.getLetters()).score(totalScore).build();
  }

  @Override
  public ScoreDTO create(ScoreCreateDTO request) {
    log.info("Creating new score entry for letters: {}", request.getLetters());
    int totalScore = scoringRulesService.computeScore(request.getLetters());

    Score score =
        Score.builder().letters(request.getLetters().toUpperCase()).points(totalScore).build();

    Score savedScore = scoreRepository.save(score);
    log.info(
        "Created score entry with ID: {}, letters: {}, points: {}",
        savedScore.getId(),
        savedScore.getLetters(),
        savedScore.getPoints());

    return ScoreDTO.builder()
        .id(savedScore.getId())
        .letters(savedScore.getLetters())
        .points(savedScore.getPoints())
        .createdAt(savedScore.getCreatedAt())
        .build();
  }

  @Override
  public List<TopScoreDTO> findTopScores(Pageable pageable) {
    for (Sort.Order order : pageable.getSort()) {
      if (!ALLOWED_SORT_FIELDS.contains(order.getProperty())) {
        log.warn("Invalid sort field attempted: {}", order.getProperty());
        throw new IllegalArgumentException(
            String.format("Invalid sort field: %s.", order.getProperty()));
      }
    }

    if (pageable.getPageSize() > MAX_PAGE_SIZE) {
      log.warn(
          "Page size {} exceeds maximum allowed size {}", pageable.getPageSize(), MAX_PAGE_SIZE);
      throw new IllegalArgumentException(
          String.format("Page size cannot exceed %d.", MAX_PAGE_SIZE, pageable.getPageSize()));
    }

    List<Score> topScores = scoreRepository.findAll(pageable).getContent();

    List<TopScoreDTO> result = new ArrayList<>();
    for (int i = 0; i < topScores.size(); i++) {
      Score score = topScores.get(i);
      result.add(
          TopScoreDTO.builder()
              .id(score.getId())
              .rank(i + 1)
              .score(score.getPoints())
              .letters(score.getLetters())
              .createdAt(score.getCreatedAt())
              .build());
    }
    log.info("Returning {} top score records", result.size());
    return result;
  }

  @Override
  public void deleteByIds(List<UUID> ids) {
    scoreRepository.deleteAllById(ids);
  }
}
