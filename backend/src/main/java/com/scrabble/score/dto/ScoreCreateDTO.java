package com.scrabble.score.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScoreCreateDTO {
  @NotBlank(message = "Letters field is required and cannot be empty")
  @Size(max = 10, message = "Letters cannot exceed 10 characters")
  private String letters;
}
