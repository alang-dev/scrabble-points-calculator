# C3: Backend API Components

*What are the key API endpoints and components within the backend application?*

## API Application Components (Backend)

**Base path:** `/api/v1`

### Games
- `GameController` - REST endpoints for game operations
  * `POST   /games` – Create a new game session
  * `GET    /games/{gameId}` – Get details of the game session
- `GameService` - Business logic for game management  
- `GameRepository` - Data access layer for games

### Players
- `PlayerController` - REST endpoints for player operations
  * `POST   /players` – Create a new player (random name if not provided)
  * `GET    /players/{playerId}` – Get details of the player
  * `PATCH  /players/{playerId}` – Update player info (`name`)
- `PlayerService` - Business logic for player management
- `PlayerRepository` - Data access layer for players

### Scores
- `ScoreController` - REST endpoints for score operations
  * `POST   /players/{playerId}/scores/compute` – Compute score for a game (`gameId`, `actions`)
  * `POST   /players/{playerId}/scores` – Save score for a game (`gameId`, `score`)
- `ScoreService` - Business logic for score calculation and management
- `ScoreRepository` - Data access layer for scores

### Leaderboard
- `LeaderboardController` - REST endpoints for leaderboard operations
  * `GET    /leaderboard?limit={n}` – Get top scores globally (default top 10)
- `LeaderboardService` - Business logic for leaderboard ranking