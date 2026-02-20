### Modified Requirement: Opponent UNO Indicator

The system SHALL display an "UNO!" indicator overlaid on opponent avatars when they have exactly 1 card.

#### Scenario: Indicator appears at 1 card

- **WHEN** an opponent's card count is exactly 1
- **THEN** a bold "UNO!" text indicator is displayed directly over their avatar
- **AND** the indicator is always visible (not hover-triggered)

#### Scenario: Indicator disappears when card count changes

- **WHEN** an opponent's card count changes from 1 to any other number
- **THEN** the "UNO!" indicator is removed

#### Scenario: Indicator styling and animation

- **WHEN** the "UNO!" indicator is displayed
- **THEN** it uses a highly visible styling (e.g., strong shadow or contrasting stroke) to stand out over the avatar
- **AND** it maintains the existing bouncing animation to draw attention

### ADDED Requirement: Opponent Chat Balloon

The system SHALL display temporary chat balloons above opponent avatars when they send a message.

#### Scenario: Balloon appearance on message

- **WHEN** an opponent sends a chat message
- **THEN** a chat balloon containing the message text appears above their avatar
- **AND** the balloon uses a smooth fade-in animation (no bouncing)
- **AND** the balloon text is easily readable against the background

#### Scenario: Balloon positioning

- **WHEN** the chat balloon is displayed
- **THEN** it uses CSS anchor positioning (or fallback absolute positioning) to anchor above and slightly to the right of the avatar, pointing down toward the player

#### Scenario: 10-second fade out per message

- **WHEN** a chat message has been visible for the configured duration (default: 10 seconds)
- **THEN** that specific message is removed from the balloon
- **AND** if a message that will disappear is the only one remaining in the chat balloon, the balloon itself fades-out with the message

#### Scenario: Appending messages within 10-second window

- **WHEN** an opponent sends a new message within 10 seconds of their previous message
- **THEN** the new message text is appended beneath the existing active chat balloon
- **AND** the new message starts its own independent 10-second fade-out timer
