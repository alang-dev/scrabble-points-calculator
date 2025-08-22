# C4: Code Implementation

*How do the backend service components interact with each other?*

## Backend Service Layer Class Diagram

```mermaid
classDiagram
    class GameSessionService {
        -gameSessionRepository: GameSessionRepository
        -playerService: PlayerService
        +create() GameSessionDTO
        +getById(sessionId: String) GameSessionDTO
    }
    
    class PlayerService {
        -playerRepository: PlayerRepository
        +create(createPlayerDTO: CreatePlayerDTO) PlayerDTO
        +getById(playerId: String) PlayerDTO
        -generateRandomPlayerName() String
    }
    
    class ScoreService {
        -scoreRepository: ScoreRepository
        -playerService: PlayerService
        -gameSessionService: GameSessionService
        +getScoringRules() ScoringRulesDTO
        +computeScore(request: ScoreComputeDTO) ScoreDTO
        +create(request: ScoreCreateDTO) ScoreDTO
    }
    
    class LeaderboardService {
        -scoreRepository: ScoreRepository
        +findTopScores(request: LeaderboardRequestDTO) LeaderboardDTO
    }

    %% Service Dependencies
    GameSessionService --> PlayerService
    ScoreService --> PlayerService
    ScoreService --> GameSessionService
```