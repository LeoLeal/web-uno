## Context

The current host detection logic checks `awareness.getStates().size` immediately upon connection. However, `y-webrtc` awareness starts with only the local peer's state and takes time to sync with existing peers in the room. This causes a race condition where:

1. Player A joins (becomes host) - correct
2. Player B joins 5 seconds later
3. Player B's awareness initially shows only 1 peer (themselves)
4. Player B thinks they're first and claims host
5. After sync completes, Player B sees Player A but host is already claimed

## Goals / Non-Goals

**Goals:**
- Ensure late joiners never claim host if host already exists
- Detect existing host correctly even with awareness sync delay
- Maintain "first peer = host" rule for room creators

**Non-Goals:**
- Changing host migration or handoff logic
- Adding retry mechanisms or timeouts
- Modifying the awareness protocol itself

## Decisions

### Delayed Host Claim for Late Joiners
- **Decision**: For non-first peers, delay host claim check until awareness has synced with at least one other peer OR timeout after brief period
- **Implementation**: 
  - Track if we're in "discovery mode" (checking for existing host)
  - Wait for awareness `change` event showing other peers
  - If other peers found with host, don't claim
  - If other peers found without host, claim (edge case recovery)
  - If no other peers after brief timeout (solo room), claim host

### First Peer Fast Path
- **Decision**: First peer in room should still claim host immediately
- **Rationale**: Room creator should not wait; they're establishing the room
- **Implementation**: Check immediately on mount, but re-check on awareness updates

### Awareness Change Handler
- **Decision**: Re-run host check on every awareness change event
- **Rationale**: Peer list changes over time; need to react to new peers
- **Implementation**: Add host check logic to awareness `change` handler

## Risks / Trade-offs

- **False Solo Detection**: If awareness takes very long to sync, user might see empty room briefly
  - *Mitigation*: Show "Connecting..." state until awareness syncs
- **Double Host (Brief)**: Two peers might both claim host before awareness syncs
  - *Mitigation*: Last-one-wins is acceptable; both will see each other eventually and one will yield visually
