## MODIFIED Requirements

### Requirement: Host Disconnection Detection
The system SHALL detect when the Host disconnects from the room.

#### Scenario: Host closes browser
- **WHEN** the Host closes their browser tab
- **THEN** the system detects the Host is no longer in awareness within 5 seconds
- **THEN** the system marks the Host as disconnected

#### Scenario: Host refreshes page
- **WHEN** the Host refreshes their browser
- **THEN** the system detects temporary disconnection
- **THEN** the system treats this as Host departure (game ends)

### Requirement: Host Disconnection Notification
The system SHALL notify all remaining players when the Host disconnects.

#### Scenario: Players see disconnect message
- **WHEN** the Host disconnects
- **THEN** all remaining players see a modal with message:
  - "Host disconnected. The game cannot continue."
  - Countdown timer showing "Returning to home in 5... 4... 3..."
- **THEN** players cannot dismiss the modal (game is over)

#### Scenario: Auto-redirect to home
- **WHEN** the countdown reaches 0
- **THEN** all players are automatically redirected to the home page
- **THEN** the room state is cleared
