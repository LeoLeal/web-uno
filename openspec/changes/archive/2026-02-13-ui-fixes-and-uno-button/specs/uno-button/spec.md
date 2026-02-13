# Spec: UNO Button

## Purpose

A clickable circular button that allows a player to call UNO when they have 2 cards remaining.

## ADDED Requirements

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

### Requirement: UNO Button Position

The UNO button SHALL be positioned above the player's hand in a consistent location.

#### Scenario: UNO button position
- **WHEN** the UNO button is visible
- **THEN** it is centered horizontally above the player's hand
- **AND** it is positioned above the "Your Turn!" label
- **AND** it does not overlap with other UI elements
