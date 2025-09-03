package com.scrabble.exception.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponseDTO {
  private LocalDateTime timestamp;
  private int status;
  private String error;
  private String message;
  private List<ValidationErrorDTO> errors;
  private String path;
}
