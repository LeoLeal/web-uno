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

#### Scenario: Hand fits screen width

- **WHEN** the player has many cards
- **THEN** card spacing automatically tightens to fit within the viewport width
- **AND** cards remain accessible and visible

#### Scenario: Player hand fixed to viewport bottom

- **WHEN** displaying the player's hand on mobile
- **THEN** the hand is anchored to the bottom of the viewport
- **AND** remains accessible regardless of screen size

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
- **AND** their name is displayed in a rounded box that overlaps the avatar's bottom edge
- **AND** the name box has a copper border and felt-dark background
- **AND** the name box has a higher z-index than the avatar

### Requirement: Opponent Card Count

The system SHALL display the number of cards each opponent holds using card back images in a fan formation.

#### Scenario: Card count fan display

- **WHEN** an opponent has N cards (any number)
- **THEN** a fan of N card backs is displayed below their avatar
- **AND** all cards are shown in a tight fan (no badge for large counts)
- **AND** cards rotate from a common pivot point (center bottom)
- **AND** the fan has a parabolic vertical offset (center cards slightly higher)

#### Scenario: Card fan arc

- **WHEN** displaying the card count fan
- **THEN** cards rotate up to 90 degrees total (spread across all cards)
- **AND** each card rotates around its bottom center pivot point
- **AND** cards overlap tightly (approximately -10px margin between cards)

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
- **AND** on desktop (≥768px), cards are displayed at 130x195px (~60% larger)
- **AND** on mobile (<768px), cards are displayed at 80x120px

#### Scenario: Discard pile display

- **WHEN** the game is playing
- **THEN** the discard pile shows the top card face-up
- **AND** previous cards are visible underneath with random rotation (±10°)
- **AND** previous cards have small random position offsets (organic pile look)
- **AND** on desktop (≥768px), cards are displayed at 130x195px (~60% larger)
- **AND** on mobile (<768px), cards are displayed at 80x120px

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
- **AND** the table center has additional bottom padding (200px) to shift piles upward for better visual prominence

### Requirement: Waiting for Player Modal

The system SHALL display a modal overlay when the game is paused due to player disconnection.

#### Scenario: Modal appears on pause

- **WHEN** the game status changes to `PAUSED_WAITING_PLAYER`
- **THEN** all players see a modal: "Game paused — waiting for a player to rejoin"
- **AND** the modal displays the name(s) and avatar(s) of disconnected player(s)
- **AND** the game board is visible but non-interactive behind the modal

#### Scenario: Host controls in modal

- **WHEN** the host views the Waiting for Player modal
- **THEN** a "Continue without [player name]" button is shown for each disconnected player
- **AND** clicking the button triggers the orphan hand removal flow

#### Scenario: Guest view of modal

- **WHEN** a non-host player views the Waiting for Player modal
- **THEN** they see the disconnected player information
- **AND** they do NOT see the "Continue without" buttons
- **AND** they see a message indicating the host will resolve the situation

#### Scenario: Modal dismisses on resume

- **WHEN** all orphan hands are resolved (replaced or removed)
- **AND** the game status returns to `PLAYING`
- **THEN** the modal closes automatically
- **AND** normal gameplay UI is restored

### Requirement: Win by Walkover Modal

The system SHALL display a victory modal when a player wins by walkover.

#### Scenario: Winner sees walkover modal

- **WHEN** all other players disconnect and the game ends as a walkover
- **THEN** the remaining player sees a modal: "You win! All other players disconnected."
- **AND** the modal has a "Back to Lobby" or "Return Home" action

#### Scenario: Walkover visual distinction

- **WHEN** displaying the walkover win modal
- **THEN** the modal visually distinguishes a walkover from a normal win (e.g., different icon or message)

### Requirement: Disconnected Player Indicator

The system SHALL visually indicate disconnected opponents on the game board.

#### Scenario: Opponent disconnect indicator

- **WHEN** a locked opponent loses their awareness connection
- **AND** the game is in `PAUSED_WAITING_PLAYER` status
- **THEN** the opponent's avatar is dimmed or greyed out
- **AND** a disconnection icon (e.g., a broken link or X) is overlaid on their avatar

#### Scenario: Reconnected/replaced player indicator

- **WHEN** a replacement player takes over an orphaned hand
- **THEN** the avatar updates to show the new player's name and avatar
- **AND** the dimming/disconnect indicator is removed
