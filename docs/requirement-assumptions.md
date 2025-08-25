# Requirement Clarification

## Tile Input Feature
*Defines how users interact with tiles and input letters*

**Tile Component Implementation:**
- Should tiles use OTP-style individual input fields? (similar to: https://devfolioco.github.io/react-otp-input/)
- Should tiles accept only letters from the scoring table (A-Z)?
- Should lowercase letters be automatically converted to uppercase?
- Should the first tile automatically receive focus on page load?
- Should input auto-advance to the next empty tile after letter entry?
- Can users navigate between tiles using backspace/arrow keys?

## Scoring & Save Feature
*Defines how scores are calculated, displayed, and saved*

- Save Score: Allow saving even when score is 0 (no restrictions)
- Backend scoring only - no offline mode support
- Users will be notified if backend connection fails
- Standard number formatting for scores (no locale-specific formatting)

## Leaderboard Feature
*Defines how top scores are displayed and what data is shown*

- View Top Scores: displays top 10 scores in modal/popup instead of separate page
- Display fields: rank, score, word entered

## System Requirements
*Technical constraints and system assumptions*

- Scoring rules displayed in the UI for user clarity
- Web application only - no responsive design requirement
- Optimized for Chrome-based browsers (Chrome, Edge, Arc, etc.)
- No cross-browser compatibility guarantee for other browsers (Firefox, Safari)

## Out of Scope
*Features not specified in requirements - assumptions made*

- No player or game session management
- No user authentication or persistent accounts required
