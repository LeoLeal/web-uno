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

The system SHALL ensure the user who created the room becomes the Host, regardless of connection order or network latency. During bootstrap, host identity SHALL be represented as tri-state: `undefined` (unresolved), `null` (resolved but unclaimed), or `number` (resolved host client ID).

#### Scenario: Creator claims host

- **WHEN** a user navigates to a room and `sessionStorage` contains a `room-creator` value matching the room ID
- **THEN** they claim Host status immediately upon room initialization
- **AND** host identity resolves to their client ID (`number` state)
- **AND** the `sessionStorage` entry is cleared to prevent re-claiming on reload

#### Scenario: Guest does not claim host

- **WHEN** a user navigates to a room WITHOUT the `room-creator` sessionStorage entry
- **THEN** they do NOT claim Host status immediately
- **THEN** host identity remains `undefined` until synchronization resolves it to `null` or a host client ID
- **BUT** they are marked as "Synced" (UI unblocked) to allow interaction

### Requirement: Host Presence Confirmation for Lobby Modals

The system SHALL treat host identity and host presence as separate concerns during room bootstrap. Host-disconnect UI SHALL be shown either after known-host absence is confirmed or after unresolved host identity remains undefined beyond a 3-second grace period.

#### Scenario: Unresolved host identity during guest bootstrap

- **WHEN** a guest joins a room and host identity is not yet resolved from shared state
- **THEN** the system treats host identity as unresolved
- **AND** the system does NOT mark the host as disconnected
- **AND** the Join Game modal remains eligible to open

#### Scenario: Unresolved host identity times out

- **WHEN** host identity remains `undefined` for at least 3 seconds after bootstrap
- **THEN** the system treats the room as host-disconnected
- **AND** the Host Disconnect modal is displayed

#### Scenario: Known host is absent

- **WHEN** host identity is resolved to a concrete host client ID
- **AND** that host is confirmed absent from awareness
- **THEN** the system marks host presence as disconnected
- **AND** the Host Disconnect modal is displayed

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

The system SHALL allow the Host to start the game ONLY when the number of connected players is between MIN_PLAYERS (3) and MAX_PLAYERS (10) inclusive. The StartGameButton SHALL display appropriate messaging for all states.

#### Scenario: Host attempts start with insufficient players

- **WHEN** fewer than MIN_PLAYERS (3) are connected
- **THEN** the "Start Game" button is disabled
- **AND** a message "Waiting for players (X/3)" is displayed

#### Scenario: Host starts with valid player count

- **WHEN** between MIN_PLAYERS (3) and MAX_PLAYERS (10) players are connected
- **THEN** the "Start Game" button is enabled
- **WHEN** the Host clicks "Start Game"
- **THEN** the game status changes to `PLAYING` for all connected peers

#### Scenario: Host attempts start with too many players

- **WHEN** more than MAX_PLAYERS (10) are connected
- **THEN** the "Start Game" button is disabled
- **AND** a message "Too many players (X/10 max)" is displayed

### Requirement: Room Capacity

The system SHALL prevent new players from joining a lobby that has reached MAX_PLAYERS capacity, except for replacement players joining during a pause. The system SHALL display an appropriate message to users attempting to join a full room.

#### Scenario: New player attempts to join full room

- **WHEN** a user navigates to a room with MAX_PLAYERS (10) already connected
- **AND** the game is in LOBBY status
- **THEN** the JoinGameModal displays "This game is full (10/10 players)"
- **AND** the name input and join button are hidden
- **AND** a message "Try creating a new game" is shown

#### Scenario: Replacement player joins during pause

- **WHEN** a room has MAX_PLAYERS (10) in lockedPlayers
- **AND** one player has disconnected (creating an orphan hand)
- **AND** the game is in PAUSED_WAITING_PLAYER status
- **THEN** a new player CAN join to fill the orphan slot
- **AND** they are matched to the orphan hand via name similarity
- **AND** the total lockedPlayers count remains at 10

#### Scenario: Game already started takes precedence

- **WHEN** a user navigates to a room with an active game in PLAYING, ROUND_ENDED, or ENDED status
- **AND** the room also happens to be at MAX_PLAYERS capacity
- **THEN** the GameAlreadyStartedModal is displayed
- **AND** the "Game Full" message is NOT shown (game status takes precedence)

### Requirement: Responsive Lobby Layout

The system SHALL display the lobby interface effectively on both mobile and desktop viewports.

#### Scenario: Mobile View

- **WHEN** the viewport width is < 768px (Mobile)
- **THEN** the player list renders as a 2-column grid
- **THEN** the "Start Game" button is fixed at the bottom of the screen (easy thumb access)

### Requirement: Player Name Input

The system SHALL prompt ALL players for their name upon joining, including the Host. Unresolved host identity SHALL NOT block the name prompt during the 3-second unresolved-host grace period.

#### Scenario: Room creator enters name

- **WHEN** a user creates a room and becomes Host
- **THEN** they see the "Join Game" modal to enter their name
- **WHEN** they enter "Alice"
- **THEN** their display name becomes "Alice" with Host privileges

#### Scenario: Guest enters name before host state fully resolves

- **WHEN** a guest joins a room and has not yet entered a name
- **AND** host identity is unresolved
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

#### Scenario: HostDisconnectModal appears only on confirmed disconnection

- **WHEN** host identity is resolved to a concrete host client ID
- **AND** host presence is confirmed disconnected
- **THEN** `HostDisconnectModal` mounts with `countdown` initialized to `5`
- **WHEN** the countdown reaches 0
- **THEN** the user is navigated to the homepage

#### Scenario: HostDisconnectModal appears after unresolved-host timeout

- **WHEN** host identity stays `undefined` for at least 3 seconds
- **THEN** `HostDisconnectModal` mounts with `countdown` initialized to `5`
- **WHEN** the countdown reaches 0
- **THEN** the user is navigated to the homepage
