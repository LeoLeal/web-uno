## Context

The host holds critical game state (the deck) in memory. When the host disconnects:
1. Game cannot continue (no deck to draw from)
2. Room becomes hostless (hostId points to disconnected peer)
3. Players are left in a broken lobby with no feedback

## Goals / Non-Goals

**Goals:**
- Detect host disconnection within reasonable time (< 5 seconds)
- Notify all remaining players with clear message
- Gracefully redirect everyone to home page
- Clean up room state to prevent confusion

**Non-Goals:**
- Host migration (transfer host to another player)
- Game state recovery (host has the deck, it's gone)
- Reconnection logic for host

## Decisions

### Host Presence Detection
- **Decision**: Check if hostId peer is still in awareness states
- **Implementation**: `awareness.getStates().has(hostId)` - if false, host is gone
- **Rationale**: Yjs awareness tracks connected peers reliably

### Disconnection UI Flow
- **Decision**: Show modal with countdown, auto-redirect after 5 seconds
- **Message**: "Host disconnected. The game cannot continue. Returning to home..."
- **Rationale**: Gives users time to understand what happened, then auto-cleanup

### State Cleanup
- **Decision**: Clear hostId from gameState, redirect to home
- **No manual refresh needed**: Auto-redirect handles cleanup
- **Rationale**: Simple, predictable behavior

## Risks / Trade-offs

- **False Positive**: Brief network hiccup might trigger disconnect
  - *Mitigation*: Wait 3-5 seconds of missing host before triggering (awareness timeout is typically ~30s, so this is conservative)
- **Host Refresh**: Host refreshing page briefly appears disconnected
  - *Acceptable*: Game still ends, host can create new room
