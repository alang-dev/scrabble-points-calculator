package com.scrabble.exception.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ValidationErrorDTO {
  private String field;
  private String message;
}
