package com.scrabble.player;

import com.scrabble.player.dto.CreatePlayerDTO;
import com.scrabble.player.dto.PlayerDTO;

public interface PlayerService {
  PlayerDTO create(CreatePlayerDTO createPlayerDTO);

  PlayerDTO getById(String playerId);
}
