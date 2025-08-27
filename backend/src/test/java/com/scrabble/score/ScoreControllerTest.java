package com.scrabble.score;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scrabble.score.dto.ScoreComputeDTO;
import com.scrabble.score.dto.ScoreCreateDTO;
import com.scrabble.score.dto.ScoreDTO;
import java.time.LocalDateTime;
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
}
