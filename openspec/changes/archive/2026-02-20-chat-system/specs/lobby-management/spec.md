### ADDED Requirement: Lobby Chat Input

The system SHALL provide a chat input area in the lobby before the game starts.

#### Scenario: Fixed position input

- **WHEN** the lobby is displayed
- **THEN** a chat input textarea is rendered above the Game Settings panel
- **AND** the input uses a fixed or sticky position so it remains visible and does not scroll out of view when the player list or settings are scrolled

#### Scenario: Sending messages

- **WHEN** a player types a message and submits it (Enter key or submit button)
- **THEN** the message is published to the `[room-id]-chat` topic
- **AND** the input is cleared immediately

### ADDED Requirement: Lobby Chat Display

The system SHALL display incoming chat messages over the player cards in the lobby.

#### Scenario: Message appearance over player card

- **WHEN** a chat message is received or sent via the lobby chat network
- **THEN** a chat balloon containing the message appears overlaying the corresponding player's card in the PlayerList
- **AND** it follows the same 10-second fade-out and 10-second append window rules defined in the room-chat spec

### Modified Requirement: Responsive Lobby Layout

The system SHALL display the lobby interface effectively on both mobile and desktop viewports, accommodating chat overlays.

#### Scenario: Mobile View (Modified)

- **WHEN** the viewport width is < 768px (Mobile)
- **THEN** the player list renders as a 3-column grid (3-per-row) instead of the previous 2-column grid, making player cards smaller to fit on screen and reducing scroll distance
- **THEN** the "Start Game" button remains fixed at the bottom of the screen
