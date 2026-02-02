## Context

Current implementation uses setTimeout delays to guess when awareness has synced. This is fragile because:
- Network timing varies
- Browser performance varies  
- Simultaneous joins create edge cases

## Goals / Non-Goals

**Goals:**
- Use Yjs shared document as single source of truth for host assignment
- Atomic, deterministic host claim operation
- Eliminate timing-based logic entirely

**Non-Goals:**
- Changing host migration (host leaving is still game over)
- Supporting multiple hosts or host handoff

## Decisions

### Shared State Approach
- **Decision**: Store `hostId` in Yjs `gameState` map
- **Implementation**: 
  - On mount: Read `hostId` from shared state
  - If `hostId` is null/undefined: Set it to my `awareness.clientID`
  - Yjs handles concurrent writes - last write wins, but check-before-write prevents multiple claims
- **Benefits**: 
  - Deterministic
  - No timing issues
  - All players agree on who is host

### Host Detection Logic
- **Decision**: Check shared state `hostId` to determine if I'm host
- **Implementation**: `isHost = (gameState.get('hostId') === myClientId)`
- **Rationale**: Simple equality check, always consistent across all peers

### Awareness Change Handler
- **Decision**: Re-check host status whenever `gameState` changes
- **Rationale**: Host can be read by anyone at any time, no race conditions

## Risks / Trade-offs

- **Brief Undefined State**: During initial connection, `hostId` might be null for all peers briefly
  - *Mitigation*: First peer to write wins, and Yjs syncs quickly. Visual "You are Host" badge might appear after brief delay (acceptable).
