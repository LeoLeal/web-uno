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

### Requirement: Host Identification
The system SHALL deterministically identify one peer as the Host. The Host is considered a participating player.

#### Scenario: First peer becomes Host
- **WHEN** a user creates a new room (and is the only peer)
- **THEN** they identify themselves as the Host
- **THEN** they initialize the `GameState` Yjs map

#### Scenario: Late joiner is Guest
- **WHEN** a user joins an already populated room
- **THEN** they identify themselves as a Guest
- **THEN** they sync the existing `GameState` from the Host

### Requirement: Connection Status
The system SHALL track and display the connection status of peers via Yjs Awareness.

#### Scenario: Peer disconnects
- **WHEN** a peer closes their tab
- **THEN** the Yjs awareness protocol updates to remove them from the active list
- **THEN** the UI updates to show them as disconnected or removes them
