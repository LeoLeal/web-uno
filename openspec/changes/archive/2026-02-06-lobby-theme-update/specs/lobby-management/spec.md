## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Lobby Header Display

The system SHALL display the Room ID in a readable format in the lobby header.

#### Scenario: Display Format

- **WHEN** in a room with ID `happy-lions-42`
- **THEN** the header displays `Happy Lions [42]`

#### Scenario: Copy Room URL Hint

- **WHEN** the room code is displayed in the header
- **THEN** it shows "(Click to copy room URL)" as the interaction hint
