package com.scrabble.player;

import com.scrabble.player.dto.CreatePlayerDTO;
import com.scrabble.player.dto.PlayerDTO;
import jakarta.persistence.EntityNotFoundException;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlayerServiceImpl implements PlayerService {

  private final PlayerRepository playerRepository;

  @Autowired
  public PlayerServiceImpl(PlayerRepository playerRepository) {
    this.playerRepository = playerRepository;
  }

  public PlayerDTO create(CreatePlayerDTO createPlayerDTO) {
    Player player = Player.builder().name(createPlayerDTO.getPlayerName()).build();
    Player savedPlayer = playerRepository.save(player);

    return PlayerDTO.builder()
        .playerId(savedPlayer.getId().toString())
        .playerName(savedPlayer.getName())
        .build();
  }

  public PlayerDTO getById(String playerId) {
    Player player =
        playerRepository
            .findById(UUID.fromString(playerId))
            .orElseThrow(
                () -> new EntityNotFoundException("Player not found with id: " + playerId));
    return PlayerDTO.builder()
        .playerId(player.getId().toString())
        .playerName(player.getName())
        .build();
  }
}
