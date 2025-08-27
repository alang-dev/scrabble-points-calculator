package com.scrabble;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class HelloControllerTest {

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    HelloController controller = new HelloController();
    mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
  }

  @Test
  void hello_ShouldReturnHelloWorld() throws Exception {
    mockMvc
        .perform(get("/api/v1/hello"))
        .andExpect(status().isOk())
        .andExpect(content().string("Hello World"));
  }
}
