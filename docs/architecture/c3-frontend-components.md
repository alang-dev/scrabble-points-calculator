# C3: Frontend Components

*What are the key components within the web application?*

## Web Application Components (Frontend)

```mermaid
graph TB
    App[App]
    
    GameBoard[GameBoard]
    TopScoresModal[TopScoresModal]
    
    subgraph "Base Components"
        Modal[Modal]
        Button[Button]
        Tile[Tile]
        Table[Table]
    end
    
    ResetButton[ResetButton]
    SaveButton[SaveButton]
    ViewTopScoresButton[ViewTopScoresButton]
    
    App --> GameBoard
    App --> TopScoresModal
    
    GameBoard --> Tiles
    GameBoard --> ScoreDisplay  
    GameBoard --> Controls
    
    Controls --> ResetButton
    Controls --> SaveButton
    Controls --> ViewTopScoresButton
    
    TopScoresModal --> Modal
    TopScoresModal --> Table
    ResetButton --> Button
    SaveButton --> Button
    ViewTopScoresButton --> Button
    Tiles --> Tile
    
    style App fill:#e8f5e8
    style GameBoard fill:#e1f5fe
    style Controls fill:#e1f5fe
    style Modal fill:#f0f0f0
    style Button fill:#f0f0f0
    style Tile fill:#f0f0f0
    style Table fill:#f0f0f0
```

## Component Structure

```
src/
├── App.tsx (Main application container managing global state)
├── components/
│   ├── GameBoard/
│   │   ├── GameBoard.tsx (Main game area)
│   │   ├── Tiles.tsx (10 empty tiles for letter input with auto-focus/navigation, uses base/Tile.tsx)
│   │   ├── ScoreDisplay.tsx (Shows current calculated score)
│   │   ├── TopScoresModal.tsx (Modal showing top 10 scores, uses base/Modal.tsx + base/Table.tsx)
│   │   └── Controls/
│   │       ├── Controls.tsx (Action buttons container)
│   │       ├── ResetButton.tsx (uses base/Button.tsx)
│   │       ├── SaveButton.tsx (uses base/Button.tsx)
│   │       └── ViewTopScoresButton.tsx (uses base/Button.tsx)
│   └── base/
│       ├── Modal.tsx (Base modal component for overlays)
│       ├── Button.tsx (Base button component)
│       ├── Tile.tsx (Base tile component for individual letter input with auto-advance)
│       └── Table.tsx (Base table component for displaying data)
```