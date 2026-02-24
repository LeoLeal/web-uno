## ADDED Requirements

### Requirement: Play sound on incoming chat message

The system SHALL play an audio notification when a chat message is received from another player.

#### Scenario: Incoming message plays chat-pop sound

- **WHEN** a valid chat message is received from a player whose `clientId` differs from the local player's `clientId`
- **AND** the game audio is not muted (`isMuted` is `false`)
- **THEN** the system SHALL play the `/sounds/chat-pop.mp3` audio file

#### Scenario: Own messages do not trigger sound

- **WHEN** a chat message is received whose `clientId` matches the local player's `clientId`
- **THEN** no chat-pop sound SHALL be played

#### Scenario: Muted state suppresses chat-pop sound

- **WHEN** a valid chat message is received from another player
- **AND** the game audio is muted (`isMuted` is `true`)
- **THEN** no chat-pop sound SHALL be played

## MODIFIED Requirements

### Requirement: Send Ephemeral Chat Messages

The system SHALL allow players to send messages using a centered input field.

#### Scenario: Chat Input UI

- **WHEN** the game is playing on a desktop viewport (≥ `md` breakpoint)
- **THEN** a centered textarea input with a send button is displayed above the player's hand and the "Your Turn!" label

#### Scenario: Chat Input UI on mobile

- **WHEN** the game is playing on a mobile viewport (< `md` breakpoint)
- **THEN** the chat input is rendered inside the top drawer, below the header content
- **AND** it is NOT rendered above the player's hand

#### Scenario: Auto-retract drawer on send (mobile)

- **WHEN** the player sends a chat message via the drawer on mobile
- **THEN** the drawer automatically retracts (closes) after the message is sent

#### Scenario: Sending and Clearing Input

- **WHEN** the player types a message and clicks send (or presses Enter)
- **THEN** the message is broadcasted to the room over the WebSocket
- **AND** the input field is immediately cleared
- **AND** the player's own message is displayed above their avatar area (or handled appropriately by the UI)
