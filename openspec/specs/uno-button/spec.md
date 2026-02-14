# Spec: UNO Button

## Purpose

A clickable circular button that allows a player to call UNO when they have 2 cards remaining.

## Requirements

### Requirement: UNO Button Visibility

The system SHALL display a UNO button above the player's hand at all times during gameplay.

#### Scenario: UNO button always visible
- **WHEN** the game is in PLAYING status
- **THEN** a circular UNO button is displayed above the player's hand
- **AND** the button is visible regardless of card count

#### Scenario: UNO button enabled at 2 cards
- **WHEN** the player's hand has exactly 2 cards
- **THEN** the UNO button is enabled and clickable
- **AND** the button has full visual prominence (btn-copper styling, "UNO!" text)
- **AND** the button has a pulsing animation to draw attention

#### Scenario: UNO button disabled with more cards
- **WHEN** the player's hand has 3 or more cards
- **THEN** the UNO button is visible but disabled
- **AND** the button is visually dimmed to indicate it cannot be clicked

### Requirement: UNO Button Appearance

The UNO button SHALL use btn-copper styling consistent with the game's theme.

#### Scenario: UNO button styling
- **WHEN** the UNO button is visible
- **THEN** it has a circular shape (~80px diameter)
- **AND** it uses btn-copper styling (gradient, copper border, shadow)
- **AND** it displays "UNO!" text when enabled
- **AND** it displays "UNO" text when disabled

#### Scenario: UNO button pulses when enabled
- **WHEN** the player's hand has exactly 2 cards (button is enabled)
- **THEN** the button has a subtle pulsing animation to draw attention
- **AND** the pulse animation is disabled if user prefers reduced motion

#### Scenario: UNO button disabled styling
- **WHEN** the player's hand has 3 or more cards
- **THEN** the button is visually dimmed (reduced opacity)
- **AND** the cursor shows not-allowed
- **AND** the button is not clickable

### Requirement: UNO Button Interaction

The UNO button SHALL be clickable and trigger the UNO call action.

#### Scenario: Clicking UNO button calls UNO
- **WHEN** the player clicks the UNO button (when enabled)
- **THEN** the UNO action is triggered
- **AND** the player's UNO status is updated to "called"

#### Scenario: UNO button shows called state
- **WHEN** the player has already called UNO
- **THEN** the button displays "UNO!" text
- **AND** the button is disabled

#### Scenario: UNO button disabled state
- **WHEN** the game is not in a playable state (paused, ended)
- **THEN** the UNO button is not clickable
- **AND** the button is visually dimmed

#### Scenario: No penalty for forgetting UNO
- **WHEN** a player plays their second-to-last card without pressing the UNO button
- **THEN** no penalty is applied
- **AND** gameplay continues normally

### Requirement: UNO Button Position

The UNO button SHALL be positioned above the player's hand in a consistent location.

#### Scenario: UNO button position
- **WHEN** the UNO button is visible
- **THEN** it is centered horizontally above the player's hand
- **AND** it is positioned above the "Your Turn!" label
- **AND** it does not overlap with other UI elements

### Requirement: UNO chat balloon on opponent avatars

The system SHALL display a "UNO!" chat balloon on opponent avatars when they have exactly 1 card.

#### Scenario: Balloon appears at 1 card
- **WHEN** an opponent's card count is exactly 1
- **THEN** a "UNO!" mini chat balloon is displayed near their avatar
- **AND** the balloon is always visible (not hover-triggered)

#### Scenario: Balloon disappears when card count changes
- **WHEN** an opponent's card count changes from 1 to any other number
- **THEN** the "UNO!" chat balloon is removed

#### Scenario: Balloon positioning with CSS anchor
- **WHEN** the "UNO!" balloon is displayed
- **THEN** the opponent's avatar element has a CSS `anchor-name` property
- **AND** the balloon element uses `position-anchor` to anchor to the avatar
- **AND** the balloon is positioned above and to the right of the avatar

#### Scenario: Balloon fallback positioning
- **WHEN** the browser does not support CSS anchor positioning
- **THEN** the balloon is positioned using `position: absolute` relative to the avatar container
- **AND** the balloon appears above and to the right of the avatar

#### Scenario: Balloon styling
- **WHEN** the "UNO!" balloon is displayed
- **THEN** it has a speech bubble appearance with a small tail/pointer
- **AND** it uses a contrasting background color for visibility
- **AND** the text is bold and compact
