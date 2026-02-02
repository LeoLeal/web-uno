## MODIFIED Requirements

### Requirement: Room Creation
The system SHALL generate a readable room identifier (Friendly Code) and redirect the user to the lobby URL upon game creation. The identifier SHALL be URL-safe and lowercase.

#### Scenario: User creates a game
- **WHEN** user clicks "Create Game" on the landing page
- **THEN** the system generates a Friendly Code (e.g., `happy-lions-42`)
- **THEN** the user is redirected to `/room/[friendly-code]`

### Requirement: Room Joining Normalization
The system SHALL normalize user input for Room IDs to match the canonical format.

#### Scenario: User types with spaces
- **WHEN** user enters "Happy Lions 42"
- **THEN** it resolves to `happy-lions-42`

#### Scenario: User types with extra symbols
- **WHEN** user enters "Happy - Lions__42"
- **THEN** it resolves to `happy-lions-42`

### Requirement: Lobby Header Display
The system SHALL display the Room ID in a readable format in the lobby header.

#### Scenario: Display Format
- **WHEN** in a room with ID `happy-lions-42`
- **THEN** the header displays `Happy Lions [42]`
