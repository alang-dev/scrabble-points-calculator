package com.scrabble.score;

import com.scrabble.score.dto.ScoringRuleDTO;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class ScoringRulesServiceImpl implements ScoringRulesService {

  private static final List<ScoringRuleDTO> SCORING_RULES =
      List.of(
          ScoringRuleDTO.builder().points(1).letters("AEIOULNSTR").build(),
          ScoringRuleDTO.builder().points(2).letters("DG").build(),
          ScoringRuleDTO.builder().points(3).letters("BCMP").build(),
          ScoringRuleDTO.builder().points(4).letters("FHVWY").build(),
          ScoringRuleDTO.builder().points(6).letters("K").build(),
          ScoringRuleDTO.builder().points(8).letters("JX").build(),
          ScoringRuleDTO.builder().points(10).letters("QZ").build());

  private static final Map<Character, Integer> LETTER_SCORES =
      SCORING_RULES.stream()
          .flatMap(
              rule ->
                  rule.getLetters().chars().mapToObj(c -> Map.entry((char) c, rule.getPoints())))
          .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

  @Override
  public List<ScoringRuleDTO> getScoringRules() {
    return SCORING_RULES;
  }

  @Override
  public int computeScore(String letters) {
    if (StringUtils.isBlank(letters)) {
      return 0;
    }

    return letters
        .toUpperCase()
        .chars()
        .mapToObj(c -> (char) c)
        .mapToInt(c -> LETTER_SCORES.getOrDefault(c, 0))
        .sum();
  }
}
