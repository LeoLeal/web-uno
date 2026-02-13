## Why

During gameplay, players may disconnect (tab close, network issues, browser refresh). The current implementation has no resilience for this—if a player disconnects, there's no way to continue the game. We need to handle player disconnection gracefully by pausing the game, allowing hand handover to a replacement player, and providing the host with options to continue.

## What Changes

### Player Disconnection Detection

- When a player's awareness state disappears and `currentPlayers < lockedPlayers.length`, detect a disconnect
- Identify which player(s) disconnected by comparing current awareness to `lockedPlayers`
- Flag their hands as "orphaned" waiting for handover

### Game Pause State

- Add new status: `PAUSED_WAITING_PLAYER`
- Store `orphanHands`: array of `{ originalClientId, originalName, cards }[]`
- Game state is frozen (no turns progress) while paused
- If the disconnected player was current turn, turn remains on them until resolved

### Waiting for Player Modal

- All players see modal: "Game paused - waiting for a player to rejoin"
- Shows which player(s) disconnected (name + avatar)
- Host has button: "Continue without [player]"

### Player Replacement / Hand Handover

- When a new player joins while game is paused:
  - Automatically assign orphan hand to new player by **closest name matching**
  - If multiple orphan hands, assign in order of name similarity
- After all orphan hands are assigned, game resumes (`status = 'PLAYING'`)

### Host "Continue Without" Option

- Host can click "Continue without [player]" for each disconnected player
- The orphan hand is reshuffled into the deck
- Card count updated accordingly
- If it was the disconnected player's turn, skip to next player in turn order

### Win by Walkover (W/O)

- If the host removes all disconnected players via "Continue without" and only one player remains, that player wins
- Walkover does NOT auto-trigger on disconnect — the game pauses and waits for the host to decide
- Status set to `ENDED`, winner recorded
- Special UI: "You win! All other players disconnected."

**Out of scope** (future changes):

- Save/restore game state across sessions
- Spectator mode
- Vote to pause/resume

## Capabilities

### New Capabilities

- `game-session`: Session resilience (pause, handover, walkover)

### Modified Capabilities

- `p2p-networking`: Additional game statuses, orphan hand tracking
- `game-board-ui`: Pause modal, disconnection indicators

## Impact

- **New files**: Session management hooks, WaitingForPlayerModal, WinByWalkoverModal
- **Modified**: `useGameState.ts`, `useGameEngine.ts`, `usePlayerHand.ts`
- **State**: New Yjs fields: `orphanHands`, extended `status` enum
- **Dependencies**: Uses `lockedPlayers` from `game-start-flow` change
