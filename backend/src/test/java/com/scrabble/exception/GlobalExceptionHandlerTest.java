package com.scrabble.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.scrabble.exception.dto.ErrorResponseDTO;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

class GlobalExceptionHandlerTest {

  private GlobalExceptionHandler globalExceptionHandler;

  @BeforeEach
  void setUp() {
    globalExceptionHandler = new GlobalExceptionHandler();
  }

  @Test
  void handleIllegalArgument_ShouldReturnBadRequestResponse() {
    // Arrange
    String errorMessage = "Invalid input provided";
    IllegalArgumentException exception = new IllegalArgumentException(errorMessage);

    // Act
    ResponseEntity<ErrorResponseDTO> response =
        globalExceptionHandler.handleIllegalArgument(exception);

    // Assert
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());

    ErrorResponseDTO body = response.getBody();
    assertEquals(400, body.getStatus());
    assertEquals("Bad Request", body.getError());
    assertEquals(errorMessage, body.getMessage());
    assertTrue(body.getTimestamp() instanceof LocalDateTime);
  }

  @Test
  void handleInvalidSortField_ShouldReturnBadRequestWithCustomMessage() {
    // Arrange
    String invalidProperty = "invalidField";
    PropertyReferenceException exception =
        org.mockito.Mockito.mock(PropertyReferenceException.class);
    org.mockito.Mockito.when(exception.getPropertyName()).thenReturn(invalidProperty);

    // Act
    ResponseEntity<ErrorResponseDTO> response =
        globalExceptionHandler.handleInvalidSortField(exception);

    // Assert
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());

    ErrorResponseDTO body = response.getBody();
    assertEquals(400, body.getStatus());
    assertEquals("Bad Request", body.getError());
    assertEquals(
        "Invalid sort field: " + invalidProperty + ". Valid fields: points, createdAt",
        body.getMessage());
    assertTrue(body.getTimestamp() instanceof LocalDateTime);
  }

  @Test
  void handleValidationExceptions_ShouldReturnErrorsArray() {
    // Arrange
    Object target = new Object();
    BeanPropertyBindingResult bindingResult =
        new BeanPropertyBindingResult(target, "scoreCreateDTO");

    FieldError fieldError1 =
        new FieldError(
            "scoreCreateDTO", "letters", "Letters field is required and cannot be empty");
    FieldError fieldError2 =
        new FieldError("scoreCreateDTO", "letters", "Letters cannot exceed 10 characters");

    bindingResult.addError(fieldError1);
    bindingResult.addError(fieldError2);

    MethodParameter mockMethodParameter = org.mockito.Mockito.mock(MethodParameter.class);
    MethodArgumentNotValidException exception =
        new MethodArgumentNotValidException(mockMethodParameter, bindingResult);

    // Act
    ResponseEntity<ErrorResponseDTO> response =
        globalExceptionHandler.handleValidationExceptions(exception);

    // Assert
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());

    ErrorResponseDTO body = response.getBody();
    assertEquals(400, body.getStatus());
    assertEquals("Bad Request", body.getError());
    assertEquals("DTO validation failed", body.getMessage());
    assertTrue(body.getTimestamp() instanceof LocalDateTime);

    // Check errors array
    assertNotNull(body.getErrors());
    assertEquals(2, body.getErrors().size());

    // Verify first error
    assertEquals("letters", body.getErrors().get(0).getField());
    assertEquals(
        "Letters field is required and cannot be empty", body.getErrors().get(0).getMessage());

    // Verify second error
    assertEquals("letters", body.getErrors().get(1).getField());
    assertEquals("Letters cannot exceed 10 characters", body.getErrors().get(1).getMessage());
  }

  @Test
  void handleValidationExceptions_ShouldHandleEmptyErrorsList() {
    // Arrange
    Object target = new Object();
    BeanPropertyBindingResult bindingResult =
        new BeanPropertyBindingResult(target, "scoreCreateDTO");
    MethodParameter mockMethodParameter = org.mockito.Mockito.mock(MethodParameter.class);
    MethodArgumentNotValidException exception =
        new MethodArgumentNotValidException(mockMethodParameter, bindingResult);

    // Act
    ResponseEntity<ErrorResponseDTO> response =
        globalExceptionHandler.handleValidationExceptions(exception);

    // Assert
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());

    ErrorResponseDTO body = response.getBody();
    assertEquals(400, body.getStatus());
    assertEquals("Bad Request", body.getError());
    assertEquals("DTO validation failed", body.getMessage());

    // Check empty errors array (should be null due to @JsonInclude(NON_NULL))
    assertTrue(body.getErrors() == null || body.getErrors().isEmpty());
  }

  @Test
  void handleIllegalArgument_ShouldHandleNullMessage() {
    // Arrange
    IllegalArgumentException exception = new IllegalArgumentException();

    // Act
    ResponseEntity<ErrorResponseDTO> response =
        globalExceptionHandler.handleIllegalArgument(exception);

    // Assert
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());

    ErrorResponseDTO body = response.getBody();
    assertEquals(400, body.getStatus());
    assertEquals("Bad Request", body.getError());
    assertEquals(null, body.getMessage());
  }

  @Test
  void handleIllegalArgument_ShouldHandleEmptyMessage() {
    // Arrange
    IllegalArgumentException exception = new IllegalArgumentException("");

    // Act
    ResponseEntity<ErrorResponseDTO> response =
        globalExceptionHandler.handleIllegalArgument(exception);

    // Assert
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    assertNotNull(response.getBody());

    ErrorResponseDTO body = response.getBody();
    assertEquals(400, body.getStatus());
    assertEquals("Bad Request", body.getError());
    assertEquals("", body.getMessage());
  }
}
