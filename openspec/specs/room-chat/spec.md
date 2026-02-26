# Spec: Room Chat

## Purpose

Defines the text-based chat functionality that allows players to communicate during both the pre-game Lobby phase and the active game. The system relies on WebSocket pub/sub mechanics for ephemeral message delivery.

## Requirements

### Requirement: Connect to Chat Network

The system SHALL securely establish a secondary WebSocket connection separate from the game document for ephemeral messaging.

#### Scenario: Successful Chat Connection

- **WHEN** a player successfully connects to the game room via `useRoom` and `isSynced` is true
- **THEN** the system automatically connects a WebSocket to the signaling server and subscribes to the `[room-id]-chat` topic

### Requirement: Link Game Identity to Chat Messages

The system SHALL ensure that chat messages can only be displayed if attributed to players currently verified in the game room.

#### Scenario: Message Identity Inclusion

- **WHEN** a player publishes a chat message to the WebSocket topic
- **THEN** the message payload MUST contain their Yjs game `clientId`
- **AND** receiving clients MUST map that `clientId` to the Yjs `awareness` state

#### Scenario: Rejecting Invalid Identities

- **WHEN** a client receives a chat message with a `clientId` that is not present in the game room
- **THEN** the client MUST ignore the message

### Requirement: Display Ephemeral Chat Messages

The system SHALL display text messages in real-time without persisting them.

#### Scenario: Receiving and Rendering a Message

- **WHEN** a client receives a valid text message over the WebSocket topic
- **THEN** the system displays the message in a chat balloon above the sender's avatar
- **AND** the balloon fades in without bouncing

#### Scenario: Appending Consecutive Messages

- **WHEN** an opponent sends a new message within 10 seconds of their previous message
- **THEN** the new message text is appended to their existing chat balloon (e.g., separated by a newline or space)
- **AND** the new message starts its own independent 10-second fade-out timer

#### Scenario: Message Fade Out

- **WHEN** a specific chat message has been visible for the configured duration (default: 10 seconds)
- **THEN** that message is removed from the balloon
- **AND** if a message that will disappear is the only one remaining in the chat balloon, the balloon itself fades-out with the message

#### Scenario: Ephemeral Cleanup

- **WHEN** the player leaves the room or refreshes the page
- **THEN** all previous chat messages are destroyed and cannot be recovered

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

#### Scenario: Virtual keyboard dismisses on mobile send

- **WHEN** the player sends a chat message via the drawer on mobile
- **THEN** the mobile chat input field loses focus
- **AND** the virtual keyboard is dismissed

#### Scenario: Sending and Clearing Input

- **WHEN** the player types a message and clicks send (or presses Enter)
- **THEN** the message is broadcasted to the room over the WebSocket
- **AND** the input field is immediately cleared
- **AND** the player's own message is displayed above their avatar area (or handled appropriately by the UI)

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
