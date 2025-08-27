package com.scrabble.score;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class ScoringRulesServiceImplTest {

  private ScoringRulesServiceImpl scoringRulesService;

  @BeforeEach
  void setUp() {
    scoringRulesService = new ScoringRulesServiceImpl();
  }

  private static Stream<Arguments> scoreTestCases() {
    return Stream.of(
        Arguments.of("HELLO", 8),
        Arguments.of("A", 1),
        Arguments.of("D", 2),
        Arguments.of("B", 3),
        Arguments.of("F", 4),
        Arguments.of("K", 6),
        Arguments.of("J", 8),
        Arguments.of("Q", 10),
        Arguments.of("hello", 8),
        Arguments.of("a", 1),
        Arguments.of("HeLLo", 8),
        Arguments.of("", 0),
        Arguments.of("   ", 0),
        Arguments.of(null, 0),
        Arguments.of("HELLO123!@#", 8),
        Arguments.of("QZ", 20),
        Arguments.of("AEIOULNSTR", 10),
        Arguments.of("AAAA", 4),
        Arguments.of("QQQQ", 40));
  }

  @ParameterizedTest(name = "computeScore({0}) should be {1}")
  @MethodSource("scoreTestCases")
  void computeScore_WithVariousInputs_ShouldReturnCorrectScore(String input, int expectedScore) {
    assertEquals(expectedScore, scoringRulesService.computeScore(input));
  }
}
