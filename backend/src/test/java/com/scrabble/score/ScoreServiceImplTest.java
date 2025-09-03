package com.scrabble.score;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRuleDTO;
import com.scrabble.score.dto.TopScoreDTO;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
class ScoreServiceImplTest {

  @Mock private ScoreRepository scoreRepository;

  @Mock private ScoringRulesService scoringRulesService;

  @InjectMocks private ScoreServiceImpl scoreService;

  private Score scoreHello;
  private Score scoreWorld;
  private Score scoreTest;

  @BeforeEach
  void setUp() {
    scoreHello =
        Score.builder()
            .id(UUID.randomUUID())
            .letters("HELLO")
            .points(8)
            .createdAt(LocalDateTime.now().minusHours(1))
            .build();

    scoreWorld =
        Score.builder()
            .id(UUID.randomUUID())
            .letters("WORLD")
            .points(9)
            .createdAt(LocalDateTime.now().minusHours(2))
            .build();

    scoreTest =
        Score.builder()
            .id(UUID.randomUUID())
            .letters("TEST")
            .points(4)
            .createdAt(LocalDateTime.now())
            .build();
  }

  @Test
  void findTopScores_ShouldReturnCorrectRanking() {
    // Arrange
    List<Score> scores = Arrays.asList(scoreWorld, scoreHello, scoreTest); // Ordered by points desc
    Page<Score> scorePage = new PageImpl<>(scores);
    Pageable pageable = PageRequest.of(0, 10, Sort.by("points").descending());

    when(scoreRepository.findAll(pageable)).thenReturn(scorePage);

    // Act
    List<TopScoreDTO> result = scoreService.findTopScores(pageable);

    // Assert
    assertEquals(3, result.size());
    assertEquals(1, result.get(0).getRank());
    assertEquals(9, result.get(0).getScore());
    assertEquals("WORLD", result.get(0).getLetters());

    assertEquals(2, result.get(1).getRank());
    assertEquals(8, result.get(1).getScore());
    assertEquals("HELLO", result.get(1).getLetters());

    assertEquals(3, result.get(2).getRank());
    assertEquals(4, result.get(2).getScore());
    assertEquals("TEST", result.get(2).getLetters());
  }

  @Test
  void findTopScores_ShouldThrowException_WhenInvalidSortField() {
    // Arrange
    Pageable pageable = PageRequest.of(0, 10, Sort.by("invalidField"));

    // Act & Assert
    IllegalArgumentException exception =
        assertThrows(IllegalArgumentException.class, () -> scoreService.findTopScores(pageable));
    assertTrue(exception.getMessage().contains("Invalid sort field: invalidField"));
  }

  @Test
  void findTopScores_ShouldThrowException_WhenPageSizeExceedsMax() {
    // Arrange
    Pageable pageable = PageRequest.of(0, 101, Sort.by("points"));

    // Act & Assert
    IllegalArgumentException exception =
        assertThrows(IllegalArgumentException.class, () -> scoreService.findTopScores(pageable));
    assertTrue(exception.getMessage().contains("Page size cannot exceed 100"));
  }

  @Test
  void findTopScores_ShouldAllowValidSortFields() {
    // Arrange
    List<Score> scores = Arrays.asList(scoreHello);
    Page<Score> scorePage = new PageImpl<>(scores);

    // Test points sorting
    Pageable pageableByPoints = PageRequest.of(0, 10, Sort.by("points"));
    when(scoreRepository.findAll(pageableByPoints)).thenReturn(scorePage);

    // Test createdAt sorting
    Pageable pageableByCreatedAt = PageRequest.of(0, 10, Sort.by("createdAt"));
    when(scoreRepository.findAll(pageableByCreatedAt)).thenReturn(scorePage);

    // Act & Assert - Should not throw exceptions
    assertDoesNotThrow(() -> scoreService.findTopScores(pageableByPoints));
    assertDoesNotThrow(() -> scoreService.findTopScores(pageableByCreatedAt));
  }

  @Test
  void findTopScores_ShouldAllowMaxPageSize() {
    // Arrange
    List<Score> scores = Arrays.asList(scoreHello);
    Page<Score> scorePage = new PageImpl<>(scores);
    Pageable pageable = PageRequest.of(0, 100, Sort.by("points"));

    when(scoreRepository.findAll(pageable)).thenReturn(scorePage);

    // Act & Assert - Should not throw exception
    assertDoesNotThrow(() -> scoreService.findTopScores(pageable));
  }

  @Test
  void findTopScores_ShouldHandleEmptyResults() {
    // Arrange
    Page<Score> emptyPage = new PageImpl<>(Arrays.asList());
    Pageable pageable = PageRequest.of(0, 10, Sort.by("points"));

    when(scoreRepository.findAll(pageable)).thenReturn(emptyPage);

    // Act
    List<TopScoreDTO> result = scoreService.findTopScores(pageable);

    // Assert
    assertTrue(result.isEmpty());
  }

  @Test
  void getScoringRules_ShouldDelegateToScoringRulesService() {
    // Arrange
    List<ScoringRuleDTO> expectedRules =
        Arrays.asList(
            ScoringRuleDTO.builder().letters("A").points(1).build(),
            ScoringRuleDTO.builder().letters("B").points(3).build());
    when(scoringRulesService.getScoringRules()).thenReturn(expectedRules);

    // Act
    List<ScoringRuleDTO> result = scoreService.getScoringRules();

    // Assert
    assertEquals(expectedRules, result);
    verify(scoringRulesService, times(1)).getScoringRules();
  }

  @Test
  void computeScore_ShouldReturnCorrectScoreComputeDTO() {
    // Arrange
    String letters = "HELLO";
    int expectedScore = 8;
    ScoreCreateDTO request = ScoreCreateDTO.builder().letters(letters).build();
    when(scoringRulesService.computeScore(letters)).thenReturn(expectedScore);

    // Act
    ScoreComputeDTO result = scoreService.computeScore(request);

    // Assert
    assertNotNull(result);
    assertEquals(letters, result.getLetters());
    assertEquals(expectedScore, result.getScore());
    verify(scoringRulesService, times(1)).computeScore(letters);
  }

  @Test
  void create_ShouldSaveScoreAndReturnDTO() {
    // Arrange
    String inputLetters = "hello";
    String uppercaseLetters = "HELLO";
    int computedScore = 8;
    UUID scoreId = UUID.randomUUID();
    LocalDateTime createdAt = LocalDateTime.now();

    ScoreCreateDTO request = ScoreCreateDTO.builder().letters(inputLetters).build();

    Score savedScore =
        Score.builder()
            .id(scoreId)
            .letters(uppercaseLetters)
            .points(computedScore)
            .createdAt(createdAt)
            .build();

    when(scoringRulesService.computeScore(inputLetters)).thenReturn(computedScore);
    when(scoreRepository.save(any(Score.class))).thenReturn(savedScore);

    // Act
    ScoreDTO result = scoreService.create(request);

    // Assert
    assertNotNull(result);
    assertEquals(scoreId, result.getId());
    assertEquals(uppercaseLetters, result.getLetters());
    assertEquals(computedScore, result.getPoints());
    assertEquals(createdAt, result.getCreatedAt());

    verify(scoringRulesService, times(1)).computeScore(inputLetters);
    verify(scoreRepository, times(1)).save(any(Score.class));
  }

  @Test
  void deleteByIds_ShouldDelegateToRepository() {
    // Arrange
    List<UUID> idsToDelete = Arrays.asList(UUID.randomUUID(), UUID.randomUUID());

    // Act
    scoreService.deleteByIds(idsToDelete);

    // Assert
    verify(scoreRepository, times(1)).deleteAllById(idsToDelete);
  }
}
