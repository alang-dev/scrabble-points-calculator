package com.scrabble.score;

import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRulesDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/scores")
public class ScoreController {

  private final ScoreService scoreService;

  @Autowired
  public ScoreController(ScoreService scoreService) {
    this.scoreService = scoreService;
  }

  @GetMapping("/rules")
  public ScoringRulesDTO getScoringRules() {
    return scoreService.getScoringRules();
  }

  @PostMapping("/compute")
  public ScoreDTO computeScore(@Valid @RequestBody ScoreComputeDTO request) {
    return scoreService.computeScore(request);
  }

  @PostMapping
  public ScoreDTO createScore(@Valid @RequestBody ScoreCreateDTO request) {
    return scoreService.create(request);
  }
}