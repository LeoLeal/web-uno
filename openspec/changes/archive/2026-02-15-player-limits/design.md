## Context

The game currently has inconsistent player limit handling:
- **Engine level**: `useGameEngine.ts` checks `players.length < 2` (hardcoded minimum)
- **UI level**: `StartGameButton.tsx` checks `playerCount >= 3` (hardcoded minimum)
- **Maximum**: No maximum exists, leading to potential UI/layout issues and deck exhaustion
- **2-player scenarios**: `gameplay-turns` spec has special cases for 2-player games that are unreachable with current UI constraints

This change centralizes player limits in a constants file and enforces them consistently across all layers.

## Goals / Non-Goals

**Goals:**
- Centralize MIN_PLAYERS (=3) and MAX_PLAYERS (=10) in `lib/game/constants.ts`
- Enforce limits at lobby level (join blocking, start button validation)
- Update game-session to handle insufficient players during removal
- Remove unreachable 2-player scenarios from gameplay-turns spec
- Allow replacement players to bypass MAX_PLAYERS (filling orphan slots)

**Non-Goals:**
- Making player limits configurable at runtime
- Supporting 2-player games
- Changing deck size or card distribution
- Modifying the replacement player matching algorithm

## Decisions

### Decision: Constants location in `lib/game/constants.ts`

**Rationale**: Game-specific constants belong with other game logic, not at the project root. This file can house other game constants in the future.

**Alternative considered**: Root-level `constants.ts` - rejected because game logic should be self-contained in `lib/game/`.

### Decision: Dual-layer enforcement (Network + UI)

**Network layer** (`useRoom.ts`): Block awareness updates when at capacity. Prevents peers from even appearing in the player list.

**UI layer** (`JoinGameModal.tsx`): Check on mount and show "Game Full" message instead of join form. Provides clear user feedback.

**Rationale**: Defense in depth. Network layer prevents state contamination; UI layer provides graceful degradation.

### Decision: StartGameButton validates both MIN and MAX

**States**:
- `< MIN_PLAYERS`: "Waiting for players (X/3)" - disabled
- `MIN_PLAYERS <= count <= MAX_PLAYERS`: "Start Game" - enabled
- `> MAX_PLAYERS`: "Too many players (X/10 max)" - disabled

**Rationale**: The button is the final gate before game initialization. Even if something slips through network/UI layers, the host cannot start an invalid game.

### Decision: Replacement players bypass MAX_PLAYERS

**Rationale**: Replacements fill existing orphan slots, they don't add capacity. A game with 10 locked players that loses one has 9 active players - a replacement brings it back to 10, not 11.

**Edge case handled**: If a game has 10 players and 2 disconnect, a replacement can join to fill the first orphan. The game remains paused waiting for the second orphan to be filled or removed.

### Decision: Game ends when removal drops below MIN_PLAYERS

**Scenario**: 3 players (Host, B, C). B disconnects. C disconnects. Host removes B → 2 remain.

**Decision**: Game ends immediately with "INSUFFICIENT_PLAYERS" reason. No winner declared.

**Rationale**: 
- Prevents awkward 2-player game state
- Maintains MIN_PLAYERS invariant at all times
- Clear user feedback: "Not enough players to continue"

**Alternative considered**: Allow game to continue with 2 players - rejected because it breaks the 3-player minimum contract and would require re-enabling 2-player scenarios we just removed.

### Decision: Remove 2-player scenarios entirely (not just deprecate)

**Removed from gameplay-turns**:
- "Skip in two-player game" (Skip gives player another turn)
- "Reverse in two-player game" (Reverse acts as Skip)

**Rationale**: With MIN_PLAYERS hardcoded to 3, these scenarios are unreachable. Keeping them suggests the code needs to handle 2-player edge cases, creating maintenance burden.

**Migration path**: If MIN_PLAYERS is ever changed to 2, these scenarios would need to be restored from git history.

### Decision: Refactor winType to endType

**Rationale**: The current `winType` field with values `'LEGITIMATE' | 'WALKOVER'` is being replaced with a more comprehensive `endType` field using `'WIN' | 'INSUFFICIENT_PLAYERS'`. This better represents game end states and removes the unreachable walkover scenario.

**Changes**:
- Type renamed: `WinType` → `EndType`
- Field renamed: `winType` → `endType`  
- Value changed: `'LEGITIMATE'` → `'WIN'`
- Value removed: `'WALKOVER'` (unreachable with MIN_PLAYERS = 3)
- Value added: `'INSUFFICIENT_PLAYERS'` (game abandoned due to player count)

**Impact**: Cleaner API that distinguishes between normal wins and abandoned games.

## Risks / Trade-offs

**[Risk]** Host removes players until game ends abruptly  
→ **Mitigation**: Clear messaging: "Not enough players to continue". Host sees this outcome before the final removal (we show remaining count after removal).

**[Risk]** Players confused why they can't join a "full" game that's actually missing players  
→ **Mitigation**: Message distinguishes "Game Full" from "Game in Progress". Replacement players during pause see pause modal, not "full" message.

**[Risk]** Race condition: 10 players in room, 2 join simultaneously  
→ **Mitigation**: Network layer check in `useRoom.ts` handles this. Both check `players.length` before adding to awareness; only first succeeds, second gets rejected.

**[Risk]** Deck exhaustion with 10 players × 7 cards = 70 dealt  
→ **Mitigation**: 108 - 70 = 38 cards remain. With typical play patterns (draws, reshuffles), this is sufficient. If it becomes an issue, MAX_PLAYERS can be lowered or deck size increased separately.

**[Trade-off]** No more 2-player casual games  
→ **Acceptance**: 2-player UNO has significantly different dynamics (Reverse = Skip, etc.). The 3-player minimum ensures consistent game balance.

**[Trade-off]** No walkover victories  
→ **Acceptance**: Games that drop below minimum end without winner. This is cleaner than having 2-player edge cases or special "win by forfeit" logic.

## Migration Plan

**Phase 1: Constants and core logic**
1. Create `lib/game/constants.ts` with MIN_PLAYERS, MAX_PLAYERS
2. Update `useGameEngine.ts` to use MIN_PLAYERS constant
3. Update `StartGameButton.tsx` to use constants and add MAX check

**Phase 2: Join blocking**
4. Update `useRoom.ts` to reject connections at MAX_PLAYERS
5. Update `JoinGameModal.tsx` to show "Game Full" message

**Phase 3: Session handling**
6. Update game-session logic for insufficient players on removal
7. Add end reason tracking (`INSUFFICIENT_PLAYERS`)

**Phase 4: Tests**
8. Update all test files with hardcoded player counts
9. Add tests for MAX_PLAYERS enforcement
10. Add tests for insufficient players scenario

**Rollback**: All changes are additive (new constants) or stricter validation. Rollback is reverting the commit.

## Open Questions

- **None** - Design is complete and ready for implementation.
