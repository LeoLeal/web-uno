# Spec: Lobby Management

## Purpose

Manages the lifecycle of game rooms, including creation, joining, player lists, and game start conditions.

## Requirements

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

### Requirement: Creator Intent Cleanup

The system SHALL clear stale creator intent on home page load to prevent accidental host claiming.

#### Scenario: User returns to home page

- **WHEN** a user navigates to the home page
- **THEN** any existing `room-creator` sessionStorage entry is removed

### Requirement: Room Joining Normalization

The system SHALL normalize user input for Room IDs to match the canonical format.

#### Scenario: User types with spaces

- **WHEN** user enters "Happy Lions 42"
- **THEN** it resolves to `happy-lions-42`

#### Scenario: User types with extra symbols

- **WHEN** user enters "Happy - Lions\_\_42"
- **THEN** it resolves to `happy-lions-42`

### Requirement: Lobby Header Display

The system SHALL display the Room ID in a readable format in the lobby header.

#### Scenario: Display Format

- **WHEN** in a room with ID `happy-lions-42`
- **THEN** the header displays `Happy Lions [42]`

#### Scenario: Copy Room URL Hint

- **WHEN** the room code is displayed in the header
- **THEN** it shows "(Click to copy room URL)" as the interaction hint

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

### Requirement: Card Table Theme for Lobby

The lobby page SHALL use the Card Table design aesthetic consistent with the homepage, including green felt background, copper accent colors, and cream text.

#### Scenario: Lobby page appearance

- **WHEN** a player views the lobby page
- **THEN** the background shows the green felt texture (inherited from body)
- **AND** text uses cream color palette (--cream, --cream-dark)
- **AND** interactive elements use copper styling (.btn-copper, .input-copper)

### Requirement: Player Card Visual Style

The system SHALL display player cards with a cream/off-white background resembling physical playing cards.

#### Scenario: Player card appearance

- **WHEN** the player list is displayed
- **THEN** each player card has a cream background (--card-white)
- **AND** text on the card uses dark color for contrast
- **AND** cards have rounded corners and subtle shadow

#### Scenario: Current player highlight

- **WHEN** a player views the player list
- **THEN** their own card is visually distinguished with a copper-toned border or glow

### Requirement: Modal Theme Consistency

The system SHALL style all lobby modals (Join Game, Host Disconnect) with the Card Table aesthetic.

#### Scenario: Join Game modal appearance

- **WHEN** the Join Game modal is displayed
- **THEN** the modal background uses felt-toned colors
- **AND** the input uses .input-copper styling
- **AND** the submit button uses .btn-copper styling

#### Scenario: Host Disconnect modal appearance

- **WHEN** the Host Disconnect modal is displayed
- **THEN** the modal background uses felt-toned colors
- **AND** text uses cream color palette
- **AND** the modal container does NOT show a default browser focus ring/outline

### Requirement: Modal Component Lifecycle

Modal components (`GameSettingsModal`, `HostDisconnectModal`) SHALL be conditionally rendered by their parent components, mounting only when they need to be visible. This ensures state resets naturally via `useState` initializers without `useEffect` synchronization.

#### Scenario: GameSettingsModal opens

- **WHEN** the host clicks "Configure" in `GameSettingsPanel`
- **THEN** `GameSettingsModal` mounts with `draft` initialized from `currentSettings`
- **WHEN** the modal is closed
- **THEN** `GameSettingsModal` unmounts completely

#### Scenario: HostDisconnectModal appears

- **WHEN** `isHostConnected` becomes `false`
- **THEN** `HostDisconnectModal` mounts with `countdown` initialized to `5`
- **WHEN** the countdown reaches 0
- **THEN** the user is navigated to the homepage
