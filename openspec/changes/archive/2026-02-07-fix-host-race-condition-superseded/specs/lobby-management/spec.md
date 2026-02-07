## ADDED Requirements

### Requirement: Host Claiming
The system SHALL ensure the user who created the room becomes the Host, regardless of connection order or network latency.

#### Scenario: Creator claims host
- **WHEN** a user navigates to a room with the creation intent flag set (e.g., via "Create Game" button)
- **THEN** they claim Host status immediately upon room initialization
- **AND** the intent flag is cleared to prevent re-claiming on reload

#### Scenario: Guest does not claim host
- **WHEN** a user navigates to a room WITHOUT the creation intent flag
- **THEN** they do NOT claim Host status immediately, even if no other peers are visible yet
- **THEN** they wait for game state synchronization to determine the current host

## MODIFIED Requirements

### Requirement: Room Creation
The system SHALL generate a readable room identifier (Friendly Code) and redirect the user to the lobby URL upon game creation. The identifier SHALL be URL-safe and lowercase.

#### Scenario: User creates a game
- **WHEN** user clicks "Create Game" on the landing page
- **THEN** the system generates a Friendly Code (e.g., `happy-lions-42`)
- **THEN** the system stores a creation intent flag for this room
- **THEN** the user is navigated to `/room/[friendly-code]` via client-side routing
