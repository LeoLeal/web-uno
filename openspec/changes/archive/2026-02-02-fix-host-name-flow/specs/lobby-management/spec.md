## MODIFIED Requirements

### Requirement: Player Name Input
The system SHALL prompt ALL players for their name upon joining, including the Host.

#### Scenario: Room creator enters name
- **WHEN** a user creates a room and becomes Host
- **THEN** they see the "Join Game" modal to enter their name
- **WHEN** they enter "Alice"
- **THEN** their display name becomes "Alice" with Host privileges

#### Scenario: Guest enters name
- **WHEN** a guest joins a room
- **THEN** they see the "Join Game" modal to enter their name
- **WHEN** they enter "Bob"
- **THEN** their display name becomes "Bob"

### Requirement: Host Identification Display
The system SHALL clearly identify the Host player in the player list.

#### Scenario: Host viewed by others
- **WHEN** a non-host player views the player list
- **THEN** the Host is displayed as "Alice (Host)" with crown icon

#### Scenario: Self-view as Host
- **WHEN** the Host views the player list
- **THEN** they see their own name "Alice" with "You" badge and crown
- **AND** they do NOT see "(Host)" suffix on themselves
