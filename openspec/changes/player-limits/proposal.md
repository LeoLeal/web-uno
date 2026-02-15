## Why

The game currently has inconsistent and hardcoded player limits: the game engine allows starting with 2 players while the UI requires 3. Additionally, there is no maximum player limit, which could lead to game balance issues, UI layout problems, and potential deck exhaustion with large groups. This change centralizes player limit constants and enforces them consistently across the lobby and game lifecycle.

## What Changes

- **Centralize player limit constants** in `lib/game/constants.ts`:
  - `MIN_PLAYERS = 3` (maintains current behavior, fixes engine/UI discrepancy)
  - `MAX_PLAYERS = 10` (prevents overcrowding, ensures deck sufficiency)

- **Update lobby-management** to enforce limits:
  - StartGameButton validates both MIN and MAX players
  - Block new joins when room is at capacity (with "Game Full" message)
  - Replacement players bypass MAX limit (filling orphan slots)

- **Update game-session** to handle insufficient players and remove walkover:
  - End game when removal drops below MIN_PLAYERS (no winner)
  - Remove unreachable "Win by Walkover" scenarios
  - **Refactor**: Rename `winType` to `endType`, change values from `'LEGITIMATE'|'WALKOVER'` to `'WIN'|'INSUFFICIENT_PLAYERS'`

- **Remove unreachable scenarios** from gameplay-turns:
  - Delete 2-player "Skip acts as extra turn" scenario
  - Delete 2-player "Reverse acts as Skip" scenario
  - These are impossible with MIN_PLAYERS = 3

## Capabilities

### New Capabilities
- (none - this modifies existing capabilities)

### Modified Capabilities
- `lobby-management`: Update "Game Start Conditions" requirement to use constants and add MAX validation; add new "Room Capacity" requirement for join blocking
- `game-session`: Update "Player Replacement via Hand Handover" to clarify MAX_PLAYERS bypass for replacements; add insufficient players handling; remove walkover scenarios; refactor `winType` to `endType`
- `gameplay-turns`: Remove two 2-player game scenarios (Skip and Reverse special cases) that are no longer reachable

## Impact

- **Components**: StartGameButton, JoinGameModal, PlayerList, GameEndModal
- **Hooks**: useRoom, useGameEngine, useGameState, useSessionResilience
- **New file**: lib/game/constants.ts
- **Refactoring**: `winType` field renamed to `endType` with updated values (`'WIN'`, `'INSUFFICIENT_PLAYERS'`)
- **Removed**: WinByWalkoverModal component (unreachable code)
- **Tests**: Update all tests with hardcoded "3" player expectations and winType references
- **Behavior**: 2-player games no longer possible (breaking change for anyone using them)
