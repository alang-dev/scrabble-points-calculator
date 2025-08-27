# C3: Frontend Components

*What are the key components within the web application?*


## Component Structure

```
src/
├── App.tsx (Main application container)
├── GlobalErrorBanner.tsx (Displays global API errors)
├── main.tsx (Application entry point)
├── components/
│   ├── GameBoard/
│   │   ├── GameBoard.tsx (Main game area, composed of other components)
│   │   ├── GameBoardContext.tsx (React context for managing game state)
│   │   ├── ScoreDisplay.tsx (Shows current calculated score)
│   │   ├── ScoringRulesTable.tsx (Displays letter values from the API)
│   │   ├── TopScoresModal.tsx (Modal showing top 10 scores)
│   │   ├── Controls.tsx (Container for action buttons: Reset, Save, View Top Scores)
│   │   └── Tiles/
│   │       ├── index.tsx (Main component for letter input)
│   │       ├── TilesHeader.tsx
│   │       ├── TilesInput.tsx (Customized OTP input for tiles)
│   │       └── TilesFooter.tsx
│   ├── base/
│   │   ├── Button.tsx (Base button and icon button components)
│   │   ├── DataTable.tsx (Renders data in a styled table)
│   │   ├── Modal.tsx (Base modal component for overlays)
│   │   ├── Table.tsx (Base HTML-like table components)
│   │   └── Toast/
│   │       ├── Toaster.tsx (Displays toast notifications)
│   │       └── toast.ts (Service to trigger toasts)
├── hooks/
│   ├── useScoreCompute.ts (Debounced score calculation)
│   ├── useScoringRules.ts (Fetches scoring rules)
│   └── useTopScores.ts (Fetches top scores when modal is open)
└── lib/
    ├── api.ts (Axios instance and error handling)
    └── utils.ts (Utility functions like `cn` and date formatting)
```
