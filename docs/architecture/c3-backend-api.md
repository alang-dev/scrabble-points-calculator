# C3: Backend API Components

*What are the key API endpoints and components within the backend application?*

## API Application Components (Backend)

**Base path:** `/api/v1`

### Game Sessions
- `GameSessionController` - REST endpoints for game session operations
  * `POST   /game-sessions` – Create a new game session with player (returns sessionId, playerId, playerName)
- `GameSessionService` - Business logic for game session management  
- `GameSessionRepository` - Data access layer for game sessions

### Players
- `PlayerService` - Business logic for player management
- `PlayerRepository` - Data access layer for players

### Scores
- `ScoreController` - REST endpoints for score operations
  * `GET    /scores/rules` – Get Scrabble letter scoring rules (A-Z point values)
  * `POST   /scores/compute` – Compute score for letters (`letters`)
  * `POST   /scores` – Save score (`playerId`, `sessionId`, `letters`) - backend recomputes score
- `ScoreService` - Business logic for score calculation and management
- `ScoreRepository` - Data access layer for scores

### Leaderboard
- `LeaderboardController` - REST endpoints for leaderboard operations
  * `GET    /leaderboard?limit={n}` – Get top scores globally (default top 10)
- `LeaderboardService` - Business logic for leaderboard ranking