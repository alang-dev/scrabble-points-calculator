# C3: Database Schema

*How is data structured and related in the PostgreSQL database?*

## Database Schema (PostgreSQL)

```mermaid
erDiagram
    game_sessions {
        UUID id PK
        TIMESTAMP created_at
    }
    
    players {
        UUID id PK
        VARCHAR name
    }
    
    scores {
        UUID id PK
        UUID player_id FK
        UUID session_id FK
        VARCHAR word
        INTEGER points
        TIMESTAMP created_at
    }
    
    game_sessions ||--o{ scores : "has"
    players ||--o{ scores : "creates"
```

## Notes

### players
- **name**: Randomly generated player display name (e.g., "Player123")

### scores
- **word**: The letters that were spelled to achieve this score (letters only, A-Z)
- **points**: Backend-computed points for this word (never trust frontend)
- **created_at**: Used for tie-breaking when multiple players have the same score (earliest wins)

## Relationships

- One game session can have many scores (one-to-many)
- One player can create many scores (one-to-many)
- Each score belongs to exactly one game session and one player