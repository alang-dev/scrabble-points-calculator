package com.scrabble.gamesession;

import com.scrabble.gamesession.dto.GameSessionDTO;
import com.scrabble.player.PlayerService;
import com.scrabble.player.dto.CreatePlayerDTO;
import com.scrabble.player.dto.PlayerDTO;
import jakarta.persistence.EntityNotFoundException;
import java.util.Random;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameSessionServiceImpl implements GameSessionService {

  private final GameSessionRepository gameSessionRepository;
  private final PlayerService playerService;
  private final Random random = new Random();

  @Autowired
  public GameSessionServiceImpl(
      GameSessionRepository gameSessionRepository, PlayerService playerService) {
    this.gameSessionRepository = gameSessionRepository;
    this.playerService = playerService;
  }

  public GameSessionDTO create() {
    GameSession gameSession = GameSession.builder().build();
    GameSession savedGameSession = gameSessionRepository.save(gameSession);

    String generatedPlayerName = generateRandomPlayerName();
    CreatePlayerDTO createPlayerDTO =
        CreatePlayerDTO.builder().playerName(generatedPlayerName).build();
    PlayerDTO player = playerService.create(createPlayerDTO);

    return GameSessionDTO.builder()
        .sessionId(savedGameSession.getId().toString())
        .playerId(player.getPlayerId())
        .playerName(player.getPlayerName())
        .build();
  }

  public GameSessionDTO getById(String sessionId) {
    GameSession gameSession =
        gameSessionRepository
            .findById(UUID.fromString(sessionId))
            .orElseThrow(
                () -> new EntityNotFoundException("Game session not found with id: " + sessionId));

    return GameSessionDTO.builder().sessionId(gameSession.getId().toString()).build();
  }

  private String generateRandomPlayerName() {
    return "Player" + random.nextInt(10000);
  }
}
