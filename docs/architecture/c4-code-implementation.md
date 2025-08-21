# C4: Code Implementation

*How are the components implemented in code?* - Wait for question clarification

**Component Design: Tiles**
```
Tiles.tsx
├── State: letters (string) - All typed letters as single string
├── Props: onLettersChange(letters) - Callback to parent
├── Methods:
│   ├── handleLetterInput(letter) - Append letter to string
│   ├── handleBackspace() - Remove last character
│   ├── clearAllTiles() - Reset to empty string
```

## Implementation Details

This section will be expanded once the questions in `docs/questions.md` are clarified, particularly:

- Tile input approach (Individual input fields vs Global typing)
- Navigation and interaction patterns
- State management approach
- Component lifecycle and event handling