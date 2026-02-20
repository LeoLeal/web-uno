## ADDED Requirements

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

- **WHEN** the game is playing
- **THEN** a centered textarea input with a send button is displayed above the player's hand and the "Your Turn!" label

#### Scenario: Sending and Clearing Input

- **WHEN** the player types a message and clicks send (or presses Enter)
- **THEN** the message is broadcasted to the room over the WebSocket
- **AND** the input field is immediately cleared
- **AND** the player's own message is displayed above their avatar area (or handled appropriately by the UI)
