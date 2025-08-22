# Requirement Assumptions

## Tile Input Feature
*Defines how users interact with tiles and input letters*

**Tile Component Implementation:**
- **OTP-style individual input fields** - similar to: https://devfolioco.github.io/react-otp-input/
- Tiles accept only letters from the scoring table
- Lowercase letters are automatically converted to uppercase in the tiles UI
- First tile automatically receives focus when the component is rendered
- Input begins from the leftmost empty tile and proceeds left-to-right
- Auto-advance to next tile after each letter is entered
- Users can edit/delete letters in previously filled tiles using backspace/arrow keys

## Player Management
*Defines how players are identified and managed*

- **Player names are assigned randomly** when a new player is created
- Backend generates unique player names (e.g., "Player123", "ScrabbleUser456")
- One player per game session

## Scoring & Save Feature
*Defines how scores are calculated, displayed, and saved*

- Allow submission/saving even when score is 0 (no restrictions)
- Backend scoring only - no offline mode support
- Users will be notified if backend connection fails
- Standard number formatting for scores (no locale-specific formatting)

## Leaderboard Feature
*Defines how top scores are displayed and what data is shown*

- **Global top 10** (highest scores from all users across all sessions)
- Display fields: score, player name, recorded timestamp, word/characters
- Top 10 scores displayed in a modal/popup instead of a separate page
- Character details trimmed if too long for display

## System Requirements
*Technical constraints and system assumptions*

- Authentication & Authorization: N/A
- One player per game session
- Scoring rules displayed in the UI for user clarity
- Web application only - no responsive design requirement
- Optimized for Chrome-based browsers (Chrome, Edge, Arc, etc.)
- No cross-browser compatibility guarantee for other browsers (Firefox, Safari)