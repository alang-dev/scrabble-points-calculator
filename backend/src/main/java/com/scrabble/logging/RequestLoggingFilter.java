package com.scrabble.logging;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

/**
 * Servlet Filter for logging HTTP requests with focus on user identification and session tracking.
 */
@Component
@Slf4j
public class RequestLoggingFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;

    // Extract request details
    String sessionId = httpRequest.getSession(true).getId();
    String clientIp = getClientIpAddress(httpRequest);
    String userAgent = httpRequest.getHeader("User-Agent");
    String sanUserAgent =
        StringUtils.isBlank(userAgent) ? "N/A" : StringUtils.substring(userAgent, 0, 100);
    String method = httpRequest.getMethod();
    String uri = httpRequest.getRequestURI();

    // Log request: [HTTP Method] [URI] on first line, details on second line
    log.info(
        "[{}] [{}]\n    Session: {} | IP: {} | User-Agent: {}",
        method,
        uri,
        sessionId,
        clientIp,
        sanUserAgent);

    long startTime = System.currentTimeMillis();

    try {
      chain.doFilter(request, response);
      long duration = System.currentTimeMillis() - startTime;

      log.info(
          "[{}] [{}] RESPONSE\n    Session: {} | Status: {} | Duration: {}ms",
          method,
          uri,
          sessionId,
          httpResponse.getStatus(),
          duration);

    } catch (Exception e) {
      long duration = System.currentTimeMillis() - startTime;
      log.error(
          "[{}] [{}] ERROR\n    Session: {} | Duration: {}ms | Error: {}",
          method,
          uri,
          sessionId,
          duration,
          e.getMessage());
      throw e;
    }
  }

  private String getClientIpAddress(HttpServletRequest request) {
    // Check for IP from proxy
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (StringUtils.isNotBlank(xForwardedFor) && !"unknown".equalsIgnoreCase(xForwardedFor)) {
      return xForwardedFor.split(",")[0].trim();
    }

    String xRealIp = request.getHeader("X-Real-IP");
    if (StringUtils.isNotBlank(xRealIp) && !"unknown".equalsIgnoreCase(xRealIp)) {
      return xRealIp;
    }

    return StringUtils.defaultIfBlank(request.getRemoteAddr(), "unknown");
  }
}
