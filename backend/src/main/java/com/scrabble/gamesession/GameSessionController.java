package com.scrabble.gamesession;

import com.scrabble.gamesession.dto.GameSessionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/game-sessions")
public class GameSessionController {

  private final GameSessionService gameSessionService;

  @Autowired
  public GameSessionController(GameSessionService gameSessionService) {
    this.gameSessionService = gameSessionService;
  }

  @PostMapping
  public GameSessionDTO create() {
    return gameSessionService.create();
  }
}
