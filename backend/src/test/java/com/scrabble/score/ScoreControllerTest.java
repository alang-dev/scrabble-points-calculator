package com.scrabble.score;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import com.scrabble.score.dto.ScoringRuleDTO;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class ScoreControllerTest {

  private MockMvc mockMvc;

  @Mock private ScoreService scoreService;

  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    ScoreController controller = new ScoreController(scoreService);
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
  }

  @Test
  void computeScore_ShouldReturnComputedScore() throws Exception {
    ScoreCreateDTO request = ScoreCreateDTO.builder().letters("HELLO").build();

    ScoreComputeDTO response = ScoreComputeDTO.builder().letters("HELLO").score(8).build();

    when(scoreService.computeScore(any(ScoreCreateDTO.class))).thenReturn(response);

    mockMvc
        .perform(
            post("/api/v1/scores/compute")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.letters").value("HELLO"))
        .andExpect(jsonPath("$.score").value(8));

    verify(scoreService).computeScore(any(ScoreCreateDTO.class));
  }

  @Test
  void computeScore_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
    String invalidRequest = "{}";

    mockMvc
        .perform(
            post("/api/v1/scores/compute")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidRequest))
        .andExpect(status().isBadRequest());
  }

  @Test
  void create_ShouldCreateAndReturnScore() throws Exception {
    ScoreCreateDTO request = ScoreCreateDTO.builder().letters("HELLO").build();

    UUID scoreId = UUID.randomUUID();
    ScoreDTO response =
        ScoreDTO.builder()
            .id(scoreId)
            .letters("HELLO")
            .points(8)
            .createdAt(LocalDateTime.now())
            .build();

    when(scoreService.create(any(ScoreCreateDTO.class))).thenReturn(response);

    mockMvc
        .perform(
            post("/api/v1/scores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(scoreId.toString()))
        .andExpect(jsonPath("$.letters").value("HELLO"))
        .andExpect(jsonPath("$.points").value(8));

    verify(scoreService).create(any(ScoreCreateDTO.class));
  }

  @Test
  void create_WithInvalidRequest_ShouldReturnBadRequest() throws Exception {
    String invalidRequest = "{}";

    mockMvc
        .perform(
            post("/api/v1/scores").contentType(MediaType.APPLICATION_JSON).content(invalidRequest))
        .andExpect(status().isBadRequest());
  }

  @Test
  void create_WithLettersExceedingMaxLength_ShouldReturnBadRequest() throws Exception {
    ScoreCreateDTO request =
        ScoreCreateDTO.builder().letters("THISISMORETHANTENCHARACTERS").build();

    mockMvc
        .perform(
            post("/api/v1/scores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest());
  }

  @Test
  void computeScore_WithLettersExceedingMaxLength_ShouldReturnBadRequest() throws Exception {
    ScoreCreateDTO request =
        ScoreCreateDTO.builder().letters("THISISMORETHANTENCHARACTERS").build();

    mockMvc
        .perform(
            post("/api/v1/scores/compute")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest());
  }

  @Test
  void getScoringRules_ShouldReturnRules() throws Exception {
    List<ScoringRuleDTO> rules =
        Arrays.asList(
            ScoringRuleDTO.builder().letters("A").points(1).build(),
            ScoringRuleDTO.builder().letters("B").points(3).build(),
            ScoringRuleDTO.builder().letters("Q").points(10).build());

    when(scoreService.getScoringRules()).thenReturn(rules);

    mockMvc
        .perform(get("/api/v1/scores/rules"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].letters").value("A"))
        .andExpect(jsonPath("$[0].points").value(1))
        .andExpect(jsonPath("$[1].letters").value("B"))
        .andExpect(jsonPath("$[1].points").value(3))
        .andExpect(jsonPath("$[2].letters").value("Q"))
        .andExpect(jsonPath("$[2].points").value(10));

    verify(scoreService).getScoringRules();
  }

  @Test
  void deleteScores_ShouldDeleteSpecifiedScores() throws Exception {
    List<UUID> idsToDelete = Arrays.asList(UUID.randomUUID(), UUID.randomUUID());

    mockMvc
        .perform(
            delete("/api/v1/scores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(idsToDelete)))
        .andExpect(status().isNoContent());

    verify(scoreService).deleteByIds(anyList());
  }

  @Test
  void deleteScores_WithEmptyList_ShouldReturnNoContent() throws Exception {
    List<UUID> emptyList = Arrays.asList();

    mockMvc
        .perform(
            delete("/api/v1/scores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyList)))
        .andExpect(status().isNoContent());

    verify(scoreService).deleteByIds(anyList());
  }
}
