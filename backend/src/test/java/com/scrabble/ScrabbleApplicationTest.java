package com.scrabble;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("${spring.profiles.active:ci}")
class ScrabbleApplicationTest {

  @Test
  void contextLoads() {
    // This test ensures that the Spring application context loads successfully
  }
}
