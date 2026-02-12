## Context

The current P2P Uno implementation has no resilience for player disconnections. When a player closes their tab, loses network connectivity, or refreshes the browser, their hand is lost and the game cannot continue. This is a critical gap for multiplayer gameplay.

This design addresses graceful handling of disconnections through:
1. Detection of missing players via WebRTC awareness
2. Game pause state with orphaned hand preservation
3. Automatic hand handover to replacement players
4. Host-controlled "continue without" option
5. Win-by-walkover when all opponents disconnect

**Dependencies**: This design relies on `lockedPlayers` tracking from the `game-start-flow` change to identify expected vs. actual connected players.

## Goals / Non-Goals

**Goals:**
- Detect player disconnections within 5-10 seconds
- Pause game automatically when players disconnect
- Preserve disconnected players' hands for handover
- Enable seamless replacement player handover via name matching
- Allow host to remove disconnected players and continue
- Handle win-by-walkover when all opponents disconnect
- Ensure game state consistency during all transitions

**Non-Goals:**
- Persisting game state across sessions (if all players disconnect, game is lost)
- Reconnection of the same player with their original hand (new join = replacement)
- Spectator mode or observing games
- Vote-based pause/resume mechanisms
- Bots or AI to replace disconnected players

## Decisions

### 1. Detection via Awareness State

**Decision**: Use Yjs awareness state to detect disconnections, comparing `currentPlayers` to `lockedPlayers.length`.

**Rationale**: 
- WebRTC provider already manages peer presence through awareness
- No additional heartbeat mechanism needed
- ~5-10 second timeout aligns with user expectations

**Alternative Considered**: Custom heartbeat/ping mechanism
- Rejected: Adds complexity without benefit; Yjs awareness is reliable

### 2. Orphan Hand Storage (Host-Only)

**Decision**: Store orphaned hands in host's local React state only.

**Host State**:
```typescript
orphanHands: Array<{
  slotIndex: number;      // Player position in turn order
  originalName: string;   // For name matching
  cards: Card[];          // The orphaned hand
}>
```

**Rationale**:
- **Simpler implementation**: No Yjs schema changes or shared state synchronization needed
- **Clear separation of concerns**: Host manages game flow, peers render state
- **Sufficient for use case**: Replacement player connects to host in P2P mesh; host directly assigns hand to their slot
- **Game ends if host disconnects**: If host leaves, the game is over regardless—no need to persist orphan hands

**Handover Flow**:
1. Host detects disconnect → stores `{ slotIndex, name, cards }` in local state
2. Host sets `status = 'PAUSED_WAITING_PLAYER'` in Yjs (signal to all peers)
3. Replacement player joins → connects to host
4. Host matches name, writes hand to player's slot in Yjs
5. Host clears entry from `orphanHands` state

**Alternative Considered**: Yjs shared storage
- Rejected: Adds complexity without benefit; host-only is sufficient and simpler

### 3. Name-Based Handover Matching

**Decision**: Use closest name match algorithm for assigning orphan hands to new players.

**Rationale**:
- Friends often rejoin with same or similar names
- Simple and predictable behavior
- No external identity system needed

**Algorithm**:
1. Calculate similarity ratio: `1 - (levenshteinDistance / maxLength)` for each orphan name
2. Assign hand with highest similarity (≥ 75% threshold)
3. If no match above threshold, assign first available orphan hand

**Alternative Considered**: Random assignment
- Rejected: Confusing for players expecting their hand back

### 4. Host Authority for "Continue Without"

**Decision**: Only the host (room creator) can remove disconnected players.

**Rationale**:
- Prevents race conditions if multiple players try to modify game state
- Clear UX: one person makes the call
- Host is already trusted authority for game start

**Alternative Considered**: Any player can remove
- Rejected: Could lead to accidental or malicious player removal

### 5. Win-by-Walkover Detection

**Decision**: Check on every awareness change; if `alivePlayers === 1 && status === 'PLAYING'`, declare winner.

**Rationale**:
- Simple, event-driven detection
- Covers both gradual disconnection and sudden mass disconnect

**State Transition**:
```
PLAYING → ENDED (walkover winner recorded)
```

### 6. Turn Handling During Pause

**Decision**: If disconnected player was current turn, freeze turn pointer until resolved.

**Rationale**:
- Prevents skipping a player's turn unfairly
- Replacement player should have their turn when they receive the hand
- If host removes player, skip to next player in turn order

## Risks / Trade-offs

**[Risk] Multiple players join simultaneously and host assigns wrong hands**
→ **Mitigation**: Host processes one join at a time; React state updates are synchronous. Name matching happens sequentially—no race condition possible since all decisions flow through host's single-threaded state.

**[Risk] Host disconnects while game paused**
→ **Mitigation**: Host hand becomes orphaned like any other; new host (first connected player) can continue without players. Migration to be addressed in future change.

**[Risk] Player reconnects too quickly (before awareness timeout)**
→ **Mitigation**: If awareness returns before timeout, no pause triggered. Edge case: if reconnect is with new session, treated as replacement player (acceptable behavior).

**[Risk] Malicious player joins with similar name to steal hand**
→ **Mitigation**: Low risk for friendly games; name matching is best-effort. Not a security feature, just UX convenience.

**[Trade-off] No true reconnection**
- Players cannot reconnect and reclaim their exact hand
- New session = new player identity in P2P mesh
- **Rationale**: WebRTC peer IDs are ephemeral; building persistent identity requires out-of-band auth (out of scope)

## Migration Plan

**Deployment Steps**:
1. Update `GameStatus` type to include `PAUSED_WAITING_PLAYER`
2. Deploy UI components behind feature flag (if needed)
3. Remove flag after validation

**Rollback**: 
- Remove new status enum value
- Players in paused games will need to restart (acceptable for unreleased feature)

## Open Questions

1. ~~Host migration~~ **RESOLVED**: Host disconnection ends the game. This is an architectural constraint of the P2P mesh topology—the host is the authoritative source of truth and coordination point. Without host migration, the game cannot continue.

2. ~~Name matching threshold~~ **RESOLVED**: Use ratio-based matching at 75% similarity threshold (Levenshtein distance / max length). This handles short names better than absolute character differences (e.g., "Al" vs "Ali" = 50%, "Alexander" vs "Alexandr" = 88%).

3. ~~UI for replacement player~~ **RESOLVED**: No special UI needed. When host assigns the orphan hand, the Yjs document is updated and the replacement player simply sees their cards in the hand view like any normal player. No toast, modal, or special indication required—keeps implementation simple and avoids translation/UI complexity.
