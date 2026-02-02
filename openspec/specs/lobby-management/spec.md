# Spec: Lobby Management

## Purpose
Manages the lifecycle of game rooms, including creation, joining, player lists, and game start conditions.

## Requirements

### Requirement: Room Creation
The system SHALL generate a unique room identifier and redirect the user to the lobby URL upon game creation.

#### Scenario: User creates a game
- **WHEN** user clicks "Create Game" on the landing page
- **THEN** the system generates a random Room ID (e.g., UUID)
- **THEN** the user is redirected to `/room/[room-id]`

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

### Requirement: Player Identification
The system SHALL assign a deterministic avatar (Animal Emoji) to each player based on their ID.

#### Scenario: Avatar Assignment
- **WHEN** a player joins
- **THEN** an animal emoji is selected based on a hash of their Player ID
- **THEN** this avatar is displayed next to their name in the lobby
