package com.scrabble.exception;

import com.scrabble.exception.dto.ErrorResponseDTO;
import com.scrabble.exception.dto.ValidationErrorDTO;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponseDTO> handleIllegalArgument(IllegalArgumentException ex) {
    return badRequest(ex.getMessage());
  }

  @ExceptionHandler(PropertyReferenceException.class)
  public ResponseEntity<ErrorResponseDTO> handleInvalidSortField(PropertyReferenceException ex) {
    String message =
        "Invalid sort field: " + ex.getPropertyName() + ". Valid fields: points, createdAt";
    return badRequest(message);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponseDTO> handleValidationExceptions(
      MethodArgumentNotValidException ex) {
    List<ValidationErrorDTO> errors =
        ex.getBindingResult().getFieldErrors().stream()
            .map(
                error ->
                    ValidationErrorDTO.builder()
                        .field(error.getField())
                        .message(error.getDefaultMessage())
                        .build())
            .toList();

    return badRequest("DTO validation failed", errors);
  }

  private ResponseEntity<ErrorResponseDTO> badRequest(String message) {
    return badRequest(message, null);
  }

  private ResponseEntity<ErrorResponseDTO> badRequest(
      String message, List<ValidationErrorDTO> errors) {
    ErrorResponseDTO response =
        ErrorResponseDTO.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Bad Request")
            .message(message)
            .errors(errors)
            .build();

    return ResponseEntity.badRequest().body(response);
  }
}
