package com.scrabble.score;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scrabble.gamesession.GameSession;
import com.scrabble.gamesession.GameSessionService;
import com.scrabble.player.Player;
import com.scrabble.player.PlayerService;
import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRulesDTO;

@Service
public class ScoreServiceImpl implements ScoreService {

  private final ScoreRepository scoreRepository;
  private final PlayerService playerService;
  private final GameSessionService gameSessionService;

  // Scrabble letter point values
  private static final Map<Character, Integer> LETTER_VALUES = Map.ofEntries(
      Map.entry('A', 1), Map.entry('B', 3), Map.entry('C', 3), Map.entry('D', 2),
      Map.entry('E', 1), Map.entry('F', 4), Map.entry('G', 2), Map.entry('H', 4),
      Map.entry('I', 1), Map.entry('J', 8), Map.entry('K', 5), Map.entry('L', 1),
      Map.entry('M', 3), Map.entry('N', 1), Map.entry('O', 1), Map.entry('P', 3),
      Map.entry('Q', 10), Map.entry('R', 1), Map.entry('S', 1), Map.entry('T', 1),
      Map.entry('U', 1), Map.entry('V', 4), Map.entry('W', 4), Map.entry('X', 8),
      Map.entry('Y', 4), Map.entry('Z', 10));

  @Autowired
  public ScoreServiceImpl(
      ScoreRepository scoreRepository,
      PlayerService playerService,
      GameSessionService gameSessionService) {
    this.scoreRepository = scoreRepository;
    this.playerService = playerService;
    this.gameSessionService = gameSessionService;
  }

  public ScoringRulesDTO getScoringRules() {
    Map<Integer, List<String>> scoreGroups = new HashMap<>();

    LETTER_VALUES.forEach((letter, score) -> {
      scoreGroups.computeIfAbsent(score, k -> new ArrayList<>()).add(letter.toString());
    });

    scoreGroups.forEach((key, letters) -> {
      letters.sort(Comparator.naturalOrder());
    });

    return ScoringRulesDTO.builder()
        .scoreGroups(scoreGroups)
        .build();
  }

  public ScoreDTO computeScore(ScoreComputeDTO request) {
    // Validate that player and game session exist (throws exception if not found)
    var playerDTO = playerService.getById(request.getPlayerId());
    gameSessionService.getById(request.getSessionId());

    validateLetters(request.getLetters());
    int totalScore = calculateScore(request.getLetters());

    return ScoreDTO.builder()
        .playerId(request.getPlayerId())
        .playerName(playerDTO.getPlayerName())
        .sessionId(request.getSessionId())
        .letters(request.getLetters())
        .points(totalScore)
        .build();
  }

  @Transactional
  public ScoreDTO create(ScoreCreateDTO request) {
    // Validate that player and game session exist (throws exception if not found)
    var playerDTO = playerService.getById(request.getPlayerId());
    gameSessionService.getById(request.getSessionId());

    // Validate letters contains only supported letters
    validateLetters(request.getLetters());

    // Calculate score from letters (backend always recomputes)
    int computedScore = calculateScore(request.getLetters());

    // Use JPA references with UUIDs
    Player player = Player.builder().id(UUID.fromString(request.getPlayerId())).build();
    GameSession gameSession = GameSession.builder().id(UUID.fromString(request.getSessionId())).build();

    Score score = Score.builder()
        .player(player)
        .gameSession(gameSession)
        .word(request.getLetters())
        .points(computedScore)
        .build();

    Score savedScore = scoreRepository.save(score);

    return ScoreDTO.builder()
        .scoreId(savedScore.getId().toString())
        .playerId(request.getPlayerId())
        .playerName(playerDTO.getPlayerName())
        .sessionId(request.getSessionId())
        .letters(savedScore.getWord())
        .points(savedScore.getPoints())
        .createdAt(savedScore.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
        .build();
  }

  private void validateLetters(String letters) {
    for (char c : letters.toCharArray()) {
      if (!LETTER_VALUES.containsKey(c)) {
        throw new IllegalArgumentException("Letter '" + c + "' is not supported.");
      }
    }
  }

  private int calculateScore(String letters) {
    return letters.chars()
        .mapToObj(c -> (char) c)
        .mapToInt(c -> LETTER_VALUES.getOrDefault(c, 0))
        .sum();
  }
}
