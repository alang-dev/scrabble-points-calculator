# C4: Code Implementation

*How do the backend service components interact with each other?*

## Backend Service Layer Class Diagram

```mermaid
classDiagram
    class GameSessionService {
        -gameSessionRepository: GameSessionRepository
        -playerService: PlayerService
        +create() GameSessionDTO
        +getById(sessionId: UUID) GameSession
    }
    
    class PlayerService {
        -playerRepository: PlayerRepository
        +create(playerDTO: PlayerDTO) Player
        +getById(playerId: UUID) Player
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