# Spec: P2P Networking

## Purpose
Handles the underlying WebRTC connections, Yjs provider setup, and ephemeral messaging between peers.

## Requirements

### Requirement: Yjs Provider Initialization
The system SHALL initialize a `y-webrtc` provider using the Room ID as the signaling channel and the configured signaling URL.

#### Scenario: Provider connection
- **WHEN** the room component mounts
- **THEN** a `WebrtcProvider` is instantiated with the Room ID
- **THEN** the provider connects to the URL specified in `NEXT_PUBLIC_SIGNALING_URL` (defaulting to `ws://localhost:4444`)

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

### Requirement: Connection Status
The system SHALL track and display the connection status of peers via Yjs Awareness.

#### Scenario: Peer disconnects
- **WHEN** a peer closes their tab
- **THEN** the Yjs awareness protocol updates to remove them from the active list
- **THEN** the UI updates to show them as disconnected or removes them
