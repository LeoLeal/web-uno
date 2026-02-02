# Spec: Lobby Management

## Purpose
Manages the lifecycle of game rooms, including creation, joining, player lists, and game start conditions.

## Requirements

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

### Requirement: Lobby Presence
The system SHALL display a list of all connected peers in the lobby.

#### Scenario: User joins an existing lobby
- **WHEN** user navigates to `/room/[room-id]`
- **THEN** they are added to the synced player list
- **THEN** they see their own name and the names of other connected players

### Requirement: Game Start Conditions
The system SHALL allow the Host to start the game ONLY when at least 3 players are connected.

#### Scenario: Host attempts start with insufficient players
- **WHEN** only 2 players are connected
- **THEN** the "Start Game" button is disabled
- **THEN** a message "Waiting for players (2/3)" is displayed

#### Scenario: Host starts with sufficient players
- **WHEN** 3 or more players are connected
- **THEN** the "Start Game" button is enabled
- **WHEN** the Host clicks "Start Game"
- **THEN** the game status changes to `PLAYING` for all connected peers

### Requirement: Responsive Lobby Layout
The system SHALL display the lobby interface effectively on both mobile and desktop viewports.

#### Scenario: Mobile View
- **WHEN** the viewport width is < 768px (Mobile)
- **THEN** the player list renders as a 2-column grid
- **THEN** the "Start Game" button is fixed at the bottom of the screen (easy thumb access)

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

### Requirement: Player Identification
The system SHALL assign a deterministic avatar (Animal Emoji) to each player based on their ID.

#### Scenario: Avatar Assignment
- **WHEN** a player joins
- **THEN** an animal emoji is selected based on a hash of their Player ID
- **THEN** this avatar is displayed next to their name in the lobby
