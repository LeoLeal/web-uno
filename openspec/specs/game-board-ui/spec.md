# Spec: Game Board UI

## Purpose

Visual layout for the Uno game board showing player's hand, opponents, deck, and discard pile.

## Requirements

### Requirement: Player Hand Display

The system SHALL display the current player's cards fanned in an arc at the bottom of the screen.

#### Scenario: Hand fan appearance

- **WHEN** the game is playing and the player has cards
- **THEN** cards are displayed in a curved arc resembling cards held in a hand
- **AND** cards overlap slightly with the center card highest
- **AND** each card is rotated to follow the arc curve

#### Scenario: Hand fan sizing

- **WHEN** displaying the player's hand
- **THEN** cards are displayed at full size (larger than opponent cards)
- **AND** the fan adapts to the number of cards (more cards = tighter spacing)

### Requirement: Opponent Display

The system SHALL display opponents around the edge of the viewport with circular avatars.

#### Scenario: Opponent positioning

- **WHEN** there are N opponents (excluding current player)
- **THEN** opponents are displayed in a horizontal row at the top of the game area
- **AND** opponents are evenly spaced across the row
- **AND** each opponent is displayed as a circular avatar

#### Scenario: Opponent avatar display

- **WHEN** displaying an opponent
- **THEN** their animal emoji avatar is shown in a circle
- **AND** their name is displayed near the avatar
- **AND** the number of cards they hold is shown below the avatar

### Requirement: Opponent Card Count

The system SHALL display the number of cards each opponent holds using card back images.

#### Scenario: Card count display

- **WHEN** an opponent has N cards
- **THEN** a small representation of N card backs is shown below their avatar
- **AND** card backs are displayed smaller than the player's hand cards

### Requirement: Current Turn Indicator

The system SHALL visually highlight the player whose turn it is.

#### Scenario: Current turn highlight

- **WHEN** it is a player's turn
- **THEN** their avatar has a golden border
- **AND** their avatar has a golden glow effect
- **AND** the highlight is clearly visible to all players

#### Scenario: Self turn indicator

- **WHEN** it is the current player's own turn
- **THEN** their hand area is subtly highlighted
- **AND** a visual cue indicates they should play

### Requirement: Table Center Display

The system SHALL display the deck and discard pile in the center of the game area.

#### Scenario: Deck display

- **WHEN** the game is playing
- **THEN** the deck is shown as a stack of face-down cards (card backs)
- **AND** the deck appears as a pile (slight offset to show depth)

#### Scenario: Discard pile display

- **WHEN** the game is playing
- **THEN** the discard pile shows the top card face-up
- **AND** previous cards are visible underneath with random rotation (±10°)
- **AND** previous cards have small random position offsets (organic pile look)

### Requirement: Header Preservation

The system SHALL keep the existing lobby header when in the game view.

#### Scenario: Header content

- **WHEN** the game is playing
- **THEN** the header shows room code, connection status, and leave button
- **AND** the header layout matches the lobby header exactly

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
