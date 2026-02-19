## MODIFIED Requirements

### Requirement: Table Center Display

The system SHALL display the deck and discard pile in the center of the game area.

#### Scenario: Deck display

- **WHEN** the game is playing
- **THEN** the deck is shown as a stack of face-down cards (card backs)
- **AND** the deck appears as a pile (slight offset to show depth)
- **AND** on desktop (>=768px), cards are displayed at 130x195px (~60% larger)
- **AND** on mobile (<768px), cards are displayed at 80x120px

#### Scenario: Discard pile display

- **WHEN** the game is playing
- **THEN** the discard pile shows the top card face-up
- **AND** previous cards are visible underneath with random rotation (up to +/-30 degrees)
- **AND** previous cards have small random position offsets (organic pile look)
- **AND** transform values for currently visible discard cards remain stable while those cards stay visible
- **AND** cards that leave the visible discard subset are pruned from transform history
- **AND** cards that later re-enter visibility receive newly generated random transform values
- **AND** on desktop (>=768px), cards are displayed at 130x195px (~60% larger)
- **AND** on mobile (<768px), cards are displayed at 80x120px

#### Scenario: Wild card on discard with chosen color

- **WHEN** the top discard card is a wild card with an assigned color
- **THEN** the card is rendered using the `WildCardSvg` component
- **AND** the `chosen-{color}` CSS class is applied
- **AND** all quadrants except the chosen color appear grayscale
