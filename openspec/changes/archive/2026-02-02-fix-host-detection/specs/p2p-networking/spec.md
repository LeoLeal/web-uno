## MODIFIED Requirements

### Requirement: Host Identification
The system SHALL deterministically identify one peer as the Host. The Host is considered a participating player. The first peer to connect SHALL automatically become Host.

#### Scenario: First peer becomes Host immediately
- **WHEN** a user creates a new room (and is the only peer)
- **THEN** they immediately identify themselves as the Host upon connection
- **THEN** they initialize the `GameState` Yjs map

#### Scenario: Late joiner detects existing Host
- **WHEN** a user joins an already populated room with an existing Host
- **THEN** they identify themselves as a Guest
- **THEN** they sync the existing `GameState` from the Host

#### Scenario: Late joiner becomes Host if none exists
- **WHEN** a user joins a room with peers but no Host (edge case)
- **THEN** they claim Host status
- **THEN** they initialize the `GameState` Yjs map
