## MODIFIED Requirements

### Requirement: Room Creation
The system SHALL generate a readable room identifier (Friendly Code) and redirect the user to the lobby URL upon game creation. The identifier SHALL be URL-safe and lowercase.

#### Scenario: User creates a game
- **WHEN** user clicks "Create Game" on the landing page
- **THEN** the system generates a Friendly Code (e.g., `happy-lions-42`)
- **THEN** the system sets a `room-creator` cookie scoped to the new room path
- **THEN** the user is redirected to `/room/[friendly-code]`

### Requirement: Host Claiming
The system SHALL ensure the user who created the room becomes the Host, regardless of connection order or network latency.

#### Scenario: Creator claims host
- **WHEN** a user navigates to a room and possesses a valid `room-creator` cookie for that room
- **THEN** they claim Host status immediately upon room initialization
- **AND** the cookie is cleared to prevent re-claiming on reload

#### Scenario: Guest does not claim host
- **WHEN** a user navigates to a room WITHOUT the creation cookie
- **THEN** they do NOT claim Host status immediately
- **THEN** they wait for game state synchronization to determine the current host
- **BUT** they are marked as "Synced" (UI unblocked) to allow interaction
