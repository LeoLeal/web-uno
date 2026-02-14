# Delta Spec: game-board-ui

This delta spec modifies the game-board-ui capability to add responsive card sizing for desktop breakpoints.

## ADDED Requirements

(None - this change only modifies existing requirements)

## MODIFIED Requirements

### Requirement: Table Center Display

The system SHALL display the deck and discard pile in the center of the game area.

#### Scenario: Deck display

- **WHEN** the game is playing
- **THEN** the deck is shown as a stack of face-down cards (card backs)
- **AND** the deck appears as a pile (slight offset to show depth)
- **AND** on desktop (≥768px), cards are displayed at 130x195px (~60% larger)
- **AND** on mobile (<768px), cards are displayed at 80x120px

#### Scenario: Discard pile display

- **WHEN** the game is playing
- **THEN** the discard pile shows the top card face-up
- **AND** previous cards are visible underneath with random rotation (±10°)
- **AND** previous cards have small random position offsets (organic pile look)
- **AND** on desktop (≥768px), cards are displayed at 130x195px (~60% larger)
- **AND** on mobile (<768px), cards are displayed at 80x120px

### Requirement: Responsive Layout

The system SHALL adapt the game board to different screen sizes.

#### Scenario: Mobile layout

- **WHEN** viewport width is less than 768px
- **THEN** opponent avatars are positioned at the top of the screen
- **AND** the table center is in the middle
- **AND** the player's hand is at the bottom with easy thumb access

#### Scenario: Desktop layout

- **WHEN** viewport width is 768px or greater
- **THEN** opponents can be spread more widely
- **AND** more cards can be visible in the player's hand without overlap compression
- **AND** the table center has additional bottom padding (200px) to shift piles upward for better visual prominence

## REMOVED Requirements

(None)
