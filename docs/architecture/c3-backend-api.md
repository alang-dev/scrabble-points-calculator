# C3: Backend API Components

*What are the key API endpoints and components within the backend application?*

## API Application Components (Backend)

**Base path:** `/api/v1`

### Scores
- `ScoreController` - REST endpoints for score operations
  * `GET    /scores/rules` – Get Scrabble letter scoring rules.
  * `POST   /scores/compute` – Compute score for a given `letters`.
  * `POST   /scores` – Save a tiles value and its score. The backend computes the score.
  * `GET    /scores` – Get top scores. Supports pagination and sorting (e.g., `?page=0&size=10&sort=points,desc`).
  * `DELETE /scores` – Delete scores by a list of IDs.
- `ScoreService` - Business logic for score calculation and management.
- `ScoreRepository` - Data access layer for scores.
- `ScoringRulesService` - Service to manage and apply scoring rules.
