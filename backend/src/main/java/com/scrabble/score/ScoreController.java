package com.scrabble.score;

import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRuleDTO;
import com.scrabble.score.dto.TopScoreDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/scores")
public class ScoreController {

  private final ScoreService scoreService;

  public ScoreController(ScoreService scoreService) {
    this.scoreService = scoreService;
  }

  @GetMapping("/rules")
  public List<ScoringRuleDTO> getScoringRules() {
    return scoreService.getScoringRules();
  }

  @PostMapping("/compute")
  public ScoreComputeDTO computeScore(@RequestBody ScoreCreateDTO request) {
    return scoreService.computeScore(request);
  }

  @PostMapping
  public ScoreDTO create(@RequestBody ScoreCreateDTO request) {
    return scoreService.create(request);
  }

  @GetMapping
  public List<TopScoreDTO> getTopScores(
      @PageableDefault(size = 10, sort = {"points", "createdAt"}, direction = Sort.Direction.DESC)
      Pageable pageable) {
    return scoreService.findTopScores(pageable);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteScore(@PathVariable UUID id) {
    scoreService.delete(id);
  }
}
