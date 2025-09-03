package com.scrabble.logging;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.LoggerFactory;

@ExtendWith(MockitoExtension.class)
class RequestLoggingFilterTest {

  @Mock private HttpServletRequest request;

  @Mock private HttpServletResponse response;

  @Mock private FilterChain filterChain;

  @Mock private HttpSession session;

  private RequestLoggingFilter requestLoggingFilter;

  private Logger logger;
  private ListAppender<ILoggingEvent> listAppender;

  @BeforeEach
  void setUp() {
    requestLoggingFilter = new RequestLoggingFilter();

    logger = (Logger) LoggerFactory.getLogger(RequestLoggingFilter.class);
    listAppender = new ListAppender<>();
    listAppender.start();
    logger.addAppender(listAppender);
    logger.setLevel(Level.INFO);
  }

  @AfterEach
  void tearDown() {
    logger.detachAppender(listAppender);
  }

  @Test
  void doFilter_ShouldLogRequestAndResponseSuccessfully() throws IOException, ServletException {
    // Arrange
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getRemoteAddr()).thenReturn("192.168.1.1");
    when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
    when(request.getMethod()).thenReturn("GET");
    when(request.getRequestURI()).thenReturn("/api/v1/scores");
    when(request.getHeader("X-Forwarded-For")).thenReturn(null);
    when(request.getHeader("X-Real-IP")).thenReturn(null);
    when(response.getStatus()).thenReturn(200);

    // Act
    requestLoggingFilter.doFilter(request, response, filterChain);

    // Assert
    verify(filterChain, times(1)).doFilter(request, response);

    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(2, logsList.size());

    // Verify request log
    ILoggingEvent requestLog = logsList.get(0);
    assertEquals(Level.INFO, requestLog.getLevel());
    assertEquals(
        "[GET] [/api/v1/scores]\n    Session: SESSION123 | IP: 192.168.1.1 | User-Agent: Mozilla/5.0",
        requestLog.getFormattedMessage());

    // Verify response log
    ILoggingEvent responseLog = logsList.get(1);
    assertEquals(Level.INFO, responseLog.getLevel());
    String responseMessage = responseLog.getFormattedMessage();
    assertEquals(
        "[GET] [/api/v1/scores] RESPONSE\n    Session: SESSION123 | Status: 200 | Duration:",
        responseMessage.substring(0, responseMessage.lastIndexOf(' ')));
  }

  @Test
  void doFilter_ShouldLogErrorWhenExceptionOccurs() throws IOException, ServletException {
    // Arrange
    RuntimeException testException = new RuntimeException("Test error");
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getRemoteAddr()).thenReturn("192.168.1.1");
    when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
    when(request.getMethod()).thenReturn("POST");
    when(request.getRequestURI()).thenReturn("/api/v1/scores");
    when(request.getHeader("X-Forwarded-For")).thenReturn(null);
    when(request.getHeader("X-Real-IP")).thenReturn(null);

    doThrow(testException).when(filterChain).doFilter(request, response);

    // Act & Assert
    try {
      requestLoggingFilter.doFilter(request, response, filterChain);
    } catch (RuntimeException e) {
      assertEquals(testException, e);
    }

    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(2, logsList.size());

    // Verify request log
    ILoggingEvent requestLog = logsList.get(0);
    assertEquals(Level.INFO, requestLog.getLevel());

    // Verify error log
    ILoggingEvent errorLog = logsList.get(1);
    assertEquals(Level.ERROR, errorLog.getLevel());
    String errorMessage = errorLog.getFormattedMessage();
    String expectedPrefix = "[POST] [/api/v1/scores] ERROR\n    Session: SESSION123 | Duration:";
    String expectedSuffix = "ms | Error: Test error";
    assertEquals(true, errorMessage.startsWith(expectedPrefix));
    assertEquals(true, errorMessage.endsWith(expectedSuffix));
  }

  @Test
  void doFilter_ShouldHandleXForwardedForHeader() throws IOException, ServletException {
    // Arrange
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.1, 198.51.100.1");
    when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
    when(request.getMethod()).thenReturn("GET");
    when(request.getRequestURI()).thenReturn("/api/v1/test");
    when(response.getStatus()).thenReturn(200);

    // Act
    requestLoggingFilter.doFilter(request, response, filterChain);

    // Assert
    List<ILoggingEvent> logsList = listAppender.list;
    ILoggingEvent requestLog = logsList.get(0);
    assertEquals(
        "[GET] [/api/v1/test]\n    Session: SESSION123 | IP: 203.0.113.1 | User-Agent: Mozilla/5.0",
        requestLog.getFormattedMessage());
  }

  @Test
  void doFilter_ShouldHandleXRealIPHeader() throws IOException, ServletException {
    // Arrange
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getHeader("X-Forwarded-For")).thenReturn(null);
    when(request.getHeader("X-Real-IP")).thenReturn("203.0.113.5");
    when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
    when(request.getMethod()).thenReturn("GET");
    when(request.getRequestURI()).thenReturn("/api/v1/test");
    when(response.getStatus()).thenReturn(200);

    // Act
    requestLoggingFilter.doFilter(request, response, filterChain);

    // Assert
    List<ILoggingEvent> logsList = listAppender.list;
    ILoggingEvent requestLog = logsList.get(0);
    assertEquals(
        "[GET] [/api/v1/test]\n    Session: SESSION123 | IP: 203.0.113.5 | User-Agent: Mozilla/5.0",
        requestLog.getFormattedMessage());
  }

  @Test
  void doFilter_ShouldHandleUnknownIPWhenHeadersAreUnknown() throws IOException, ServletException {
    // Arrange
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getHeader("X-Forwarded-For")).thenReturn("unknown");
    when(request.getHeader("X-Real-IP")).thenReturn("unknown");
    when(request.getRemoteAddr()).thenReturn("192.168.1.1");
    when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
    when(request.getMethod()).thenReturn("GET");
    when(request.getRequestURI()).thenReturn("/api/v1/test");
    when(response.getStatus()).thenReturn(200);

    // Act
    requestLoggingFilter.doFilter(request, response, filterChain);

    // Assert
    List<ILoggingEvent> logsList = listAppender.list;
    ILoggingEvent requestLog = logsList.get(0);
    assertEquals(
        "[GET] [/api/v1/test]\n    Session: SESSION123 | IP: 192.168.1.1 | User-Agent: Mozilla/5.0",
        requestLog.getFormattedMessage());
  }

  @Test
  void doFilter_ShouldHandleNullUserAgent() throws IOException, ServletException {
    // Arrange
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getRemoteAddr()).thenReturn("192.168.1.1");
    when(request.getHeader("User-Agent")).thenReturn(null);
    when(request.getMethod()).thenReturn("GET");
    when(request.getRequestURI()).thenReturn("/api/v1/test");
    when(request.getHeader("X-Forwarded-For")).thenReturn(null);
    when(request.getHeader("X-Real-IP")).thenReturn(null);
    when(response.getStatus()).thenReturn(200);

    // Act
    requestLoggingFilter.doFilter(request, response, filterChain);

    // Assert
    List<ILoggingEvent> logsList = listAppender.list;
    ILoggingEvent requestLog = logsList.get(0);
    assertEquals(
        "[GET] [/api/v1/test]\n    Session: SESSION123 | IP: 192.168.1.1 | User-Agent: N/A",
        requestLog.getFormattedMessage());
  }

  @Test
  void doFilter_ShouldTruncateLongUserAgent() throws IOException, ServletException {
    // Arrange
    String longUserAgent = "A".repeat(150);
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getRemoteAddr()).thenReturn("192.168.1.1");
    when(request.getHeader("User-Agent")).thenReturn(longUserAgent);
    when(request.getMethod()).thenReturn("GET");
    when(request.getRequestURI()).thenReturn("/api/v1/test");
    when(request.getHeader("X-Forwarded-For")).thenReturn(null);
    when(request.getHeader("X-Real-IP")).thenReturn(null);
    when(response.getStatus()).thenReturn(200);

    // Act
    requestLoggingFilter.doFilter(request, response, filterChain);

    // Assert
    List<ILoggingEvent> logsList = listAppender.list;
    ILoggingEvent requestLog = logsList.get(0);
    String expectedTruncatedUserAgent = "A".repeat(100);
    assertEquals(
        "[GET] [/api/v1/test]\n    Session: SESSION123 | IP: 192.168.1.1 | User-Agent: "
            + expectedTruncatedUserAgent,
        requestLog.getFormattedMessage());
  }

  @Test
  void doFilter_ShouldHandleNullRemoteAddr() throws IOException, ServletException {
    // Arrange
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getRemoteAddr()).thenReturn(null);
    when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
    when(request.getMethod()).thenReturn("GET");
    when(request.getRequestURI()).thenReturn("/api/v1/test");
    when(request.getHeader("X-Forwarded-For")).thenReturn(null);
    when(request.getHeader("X-Real-IP")).thenReturn(null);
    when(response.getStatus()).thenReturn(200);

    // Act
    requestLoggingFilter.doFilter(request, response, filterChain);

    // Assert
    List<ILoggingEvent> logsList = listAppender.list;
    ILoggingEvent requestLog = logsList.get(0);
    assertEquals(
        "[GET] [/api/v1/test]\n    Session: SESSION123 | IP: unknown | User-Agent: Mozilla/5.0",
        requestLog.getFormattedMessage());
  }

  @Test
  void doFilter_ShouldNotThrowException() {
    // Arrange
    when(request.getSession(true)).thenReturn(session);
    when(session.getId()).thenReturn("SESSION123");
    when(request.getRemoteAddr()).thenReturn("192.168.1.1");
    when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
    when(request.getMethod()).thenReturn("GET");
    when(request.getRequestURI()).thenReturn("/api/v1/test");
    when(request.getHeader("X-Forwarded-For")).thenReturn(null);
    when(request.getHeader("X-Real-IP")).thenReturn(null);
    when(response.getStatus()).thenReturn(200);

    // Act & Assert
    assertDoesNotThrow(() -> requestLoggingFilter.doFilter(request, response, filterChain));
  }
}
