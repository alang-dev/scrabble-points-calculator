package com.scrabble.score;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

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
}
