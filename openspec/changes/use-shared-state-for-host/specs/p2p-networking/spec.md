## MODIFIED Requirements

### Requirement: Host Identification via Shared State
The system SHALL store the Host identity in the shared Yjs document state. All peers SHALL read from this shared state to determine who is the Host.

#### Scenario: First peer claims host via shared state
- **WHEN** the first peer connects to an empty room
- **THEN** they check the shared `gameState` for `hostId`
- **THEN** if `hostId` is null, they set it to their client ID
- **THEN** they become the Host

#### Scenario: Late joiner reads existing host from state
- **WHEN** a late joiner connects to a room
- **THEN** they read `hostId` from shared `gameState`
- **THEN** they see it is already set to another peer's ID
- **THEN** they do NOT modify `hostId` and become a Guest

#### Scenario: Concurrent join resolution
- **WHEN** two peers join simultaneously
- **THEN** both may attempt to set `hostId`
- **THEN** Yjs resolves the conflict (last-write-wins or CRDT merge)
- **THEN** All peers eventually agree on a single Host

#### Scenario: Host identity consistency
- **WHEN** any peer checks who is Host
- **THEN** they read `hostId` from shared state
- **THEN** they compare it with each peer's clientId
- **THEN** the matching peer is identified as Host
