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

#### Scenario: Virtual keyboard dismisses on mobile send

- **WHEN** the player sends a chat message via the drawer on mobile
- **THEN** the mobile chat input field loses focus
- **AND** the virtual keyboard is dismissed

#### Scenario: Sending and Clearing Input

- **WHEN** the player types a message and clicks send (or presses Enter)
- **THEN** the message is broadcasted to the room over the WebSocket
- **AND** the input field is immediately cleared
- **AND** the player's own message is displayed above their avatar area (or handled appropriately by the UI)
