# Questions for Clarification

## Tile Input Feature
*To define how users interact with tiles and input letters*

- Should tiles accept only letters A-Z (from the scoring table), or allow any input? 
  - **If allow any input**: How should we handle space characters in the UI - shown with lighter/darker `_` text or as blank tiles? 0 points for letter oudside of A-Z?

- How should tile component work?
  - **Option A**: Individual input fields (OTP-style) - like this: https://devfolioco.github.io/react-otp-input/
  - **Option B**: Display-only tiles with global typing - users type anywhere and letters flow left-to-right, showing the most recent 10 characters. A text box below shows the full typed text


**If Option A (Individual input fields):**
- Should the first tile automatically receive focus when the component is rendered? Should input always begin from the leftmost empty tile and proceed left-to-right?
- How should navigation work between tiles? Left-Right Arrow keys, auto-advance after each letter?
- Can users edit/delete letters in previously filled tiles?

**If Option B (Global typing with display tiles):**
- Users can type unlimited letters, but only the 10 most recent letters are displayed in tiles and used for scoring?
- If users don't click `Reset Tiles`, should the tiles continue to show the 10 most recent typed letters and automatically recompute the score, even if users pause/stop typing for a long time?

## Scoring & Save Feature
*To define how scores are calculated, displayed, and saved with player identification*

- Should we prevent submission/saving when score is 0 or no letters are entered, OR show a confirmation box?
- Should we ask the user to enter their name when the page loads or when they click `Save Score`?

## Leaderboard Feature
*To define how top scores are displayed and what data is shown*

- Should the leaderboard show a global top 10 (highest scores from all users across all sessions) or a personal top 10 (only the current user's highest scores from their own sessions)?
- Are these fields enough for top 10 scores display: score, player name, recorded timestamp, character details (trimmed if long text)?


## System Requirements (Assumptions)
*To define technical constraints and system assumptions*

**Please correct if any of these assumptions are not what you expected:**

- Authentication & Authorization: N/A
- One player per game session
- Users can type lowercase letters that are automatically converted to uppercase in the tiles UI
- Scoring rules will be displayed in the UI for user clarity
- Backend scoring only - no offline mode support (users will be notified if backend connection fails)
- Standard number formatting for scores (no locale-specific formatting)
- Top 10 scores will be displayed in a modal/popup instead of a separate page
- Web application only - no responsive design requirement
- Optimized for Chrome-based browsers (Chrome, Edge, Arc, etc.)
- No cross-browser compatibility guarantee for other browsers (Firefox, Safari)
