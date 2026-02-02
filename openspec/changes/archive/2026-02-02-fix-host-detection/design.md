## Context

The current host detection logic waits for the `synced` event before claiming host status. However, `y-webrtc`'s `synced` event only fires when the document syncs with other peers. For the first peer creating a room, this event never fires, so they never become host.

## Goals / Non-Goals

**Goals:**
- First peer in a room automatically becomes host
- Host detection works reliably for room creators
- No regression for late joiners

**Non-Goals:**
- Changing the collision detection logic
- Modifying the awareness protocol

## Decisions

### Immediate Host Claim
- **Decision**: Claim host status immediately when connecting to an empty room
- **Implementation**: Check if `awareness.getStates().size === 1` (only ourselves) upon connection
- **Rationale**: If we're the only peer, we must be the first = we should be host

### Sync Event Still Used
- **Decision**: Keep the `synced` event handler as a backup for late joiners
- **Rationale**: Late joiners need to check if host already exists before claiming

## Risks / Trade-offs

- **Race Condition**: Two peers joining simultaneously might both claim host
  - *Mitigation*: The awareness state will eventually sync, and we can add conflict resolution later if needed. For now, the first to set state wins.
