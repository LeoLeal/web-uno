## MODIFIED Requirements

### Requirement: Host Identification
The system SHALL deterministically identify one peer as the Host. The Host is considered a participating player. The first peer to connect SHALL automatically become Host. Late joiners SHALL detect existing Host and not claim Host status.

#### Scenario: First peer becomes Host immediately
- **WHEN** a user creates a new room (and is the only peer)
- **THEN** they immediately identify themselves as the Host upon connection
- **THEN** they initialize the `GameState` Yjs map

#### Scenario: Late joiner detects existing Host
- **WHEN** a user joins an already populated room with an existing Host
- **THEN** they wait for awareness to sync with existing peers
- **THEN** they detect the existing Host
- **THEN** they identify themselves as a Guest (not Host)
- **THEN** they sync the existing `GameState` from the Host

#### Scenario: Late joiner waits for awareness before claiming
- **WHEN** a user joins a room
- **THEN** they wait for awareness state to populate from other peers
- **THEN** they check if any peer has `isHost: true`
- **THEN** only claim Host if no existing host found after sync
