package com.scrabble.gamesession;

import com.scrabble.gamesession.dto.GameSessionDTO;

public interface GameSessionService {
  GameSessionDTO create();

  GameSessionDTO getById(String sessionId);
}
