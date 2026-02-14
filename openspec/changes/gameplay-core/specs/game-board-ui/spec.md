## ADDED Requirements

### Requirement: Card click interaction
The system SHALL allow the current player to click cards in their hand to play them.

#### Scenario: Clicking a playable card
- **WHEN** it is the player's turn and they click a card that is playable
- **THEN** the card play action is submitted (or the wild color modal opens if it's a wild card)

#### Scenario: Clicking an unplayable card
- **WHEN** the player clicks a card that is not playable against the current top discard card
- **THEN** no action is submitted
- **AND** the card does not respond to the click

#### Scenario: Clicking a card when not your turn
- **WHEN** it is not the player's turn and they click a card
- **THEN** no action is submitted

### Requirement: Unplayable card visual distinction
The system SHALL visually distinguish cards that cannot be played on the current turn.

#### Scenario: Unplayable cards dimmed
- **WHEN** it is the player's turn
- **THEN** cards that do not match the top discard card's color or symbol (and are not wild) are visually dimmed
- **AND** dimmed cards have reduced opacity or a desaturated appearance

#### Scenario: All cards normal when not your turn
- **WHEN** it is not the player's turn
- **THEN** all cards in the player's hand are displayed at normal opacity
- **AND** no playability distinction is shown

### Requirement: Deck pile click to draw
The system SHALL allow the current player to click the deck pile to draw a card.

#### Scenario: Clicking deck on your turn
- **WHEN** it is the player's turn and they click the deck pile
- **THEN** a `DRAW_CARD` action is submitted

#### Scenario: Clicking deck when not your turn
- **WHEN** it is not the player's turn and they click the deck pile
- **THEN** no action is submitted

#### Scenario: Deck pile cursor
- **WHEN** it is the player's turn
- **THEN** the deck pile shows a pointer cursor
- **WHEN** it is not the player's turn
- **THEN** the deck pile shows a default cursor

### Requirement: Card hover and click feedback
The system SHALL provide visual feedback when interacting with cards.

#### Scenario: Playable card hover
- **WHEN** the player hovers over a playable card on their turn
- **THEN** the card lifts up (existing translateY hover effect)
- **AND** the cursor shows as pointer

#### Scenario: Unplayable card hover
- **WHEN** the player hovers over an unplayable card on their turn
- **THEN** the card does not lift up
- **AND** the cursor shows as not-allowed

## MODIFIED Requirements

### Requirement: Discard pile display

The system SHALL display the discard pile with the top card face-up, including wild card color indication.

#### Scenario: Discard pile display
- **WHEN** the game is playing
- **THEN** the discard pile shows the top card face-up
- **AND** previous cards are visible underneath with random rotation (plus or minus 10 degrees)
- **AND** previous cards have small random position offsets (organic pile look)
- **AND** on desktop (768px and above), cards are displayed at 130x195px (approximately 60% larger)
- **AND** on mobile (below 768px), cards are displayed at 80x120px

#### Scenario: Wild card on discard with chosen color
- **WHEN** the top discard card is a wild card with an assigned color
- **THEN** the card is rendered using the SVGR wild card component
- **AND** the `chosen-{color}` CSS class is applied
- **AND** all quadrants except the chosen color appear grayscale
