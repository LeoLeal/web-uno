## MODIFIED Requirements

### Requirement: Room Creation

The system SHALL generate a readable room identifier (Friendly Code) and navigate the user to the lobby URL upon game creation. The identifier SHALL be URL-safe and lowercase. Room creation SHALL be performed entirely client-side without server involvement.

#### Scenario: User creates a game

- **WHEN** user clicks "Create Game" on the landing page
- **THEN** the system generates a Friendly Code (e.g., `happy-lions-42`) client-side
- **THEN** the system stores the room ID in `sessionStorage` under key `room-creator`
- **THEN** the user is navigated to `/room/[friendly-code]` via client-side routing

### Requirement: Host Claiming

The system SHALL ensure the user who created the room becomes the Host, regardless of connection order or network latency.

#### Scenario: Creator claims host

- **WHEN** a user navigates to a room and `sessionStorage` contains a `room-creator` value matching the room ID
- **THEN** they claim Host status immediately upon room initialization
- **AND** the `sessionStorage` entry is cleared to prevent re-claiming on reload

#### Scenario: Guest does not claim host

- **WHEN** a user navigates to a room WITHOUT the `room-creator` sessionStorage entry
- **THEN** they do NOT claim Host status immediately
- **THEN** they wait for game state synchronization to determine the current host
- **BUT** they are marked as "Synced" (UI unblocked) to allow interaction

## ADDED Requirements

### Requirement: Creator Intent Cleanup

The system SHALL clear stale creator intent on home page load to prevent accidental host claiming.

#### Scenario: User returns to home page

- **WHEN** a user navigates to the home page
- **THEN** any existing `room-creator` sessionStorage entry is removed
