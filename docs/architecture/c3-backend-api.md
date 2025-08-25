# C3: Backend API Components

*What are the key API endpoints and components within the backend application?*

## API Application Components (Backend)

**Base path:** `/api/v1`

### Scores
- `ScoreController` - REST endpoints for score operations
  * `GET    /scores/rules` – Get Scrabble letter scoring rules (A-Z point values)
  * `POST   /scores/compute` – Compute score for letters (`letters`)
  * `POST   /scores` – Save score (`letters`) - backend recomputes score
  * `GET    /scores?limit={n}&sort=DESC` – Get top scores (default top 10)
- `ScoreService` - Business logic for score calculation and management
- `ScoreRepository` - Data access layer for scores
