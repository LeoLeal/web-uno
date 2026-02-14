## ADDED Requirements

### Requirement: Card play validation rules
The system SHALL validate that a card can be played against the current game state.

#### Scenario: Wild card always playable
- **WHEN** a player attempts to play a card with no color (wild or wild-draw4)
- **THEN** the card is considered playable regardless of the current discard or active color

#### Scenario: Color match
- **WHEN** a player attempts to play a card whose color matches the current `activeColor`
- **THEN** the card is considered playable

#### Scenario: Symbol match
- **WHEN** a player attempts to play a card whose symbol matches the top discard card's symbol
- **THEN** the card is considered playable (even if colors differ)

#### Scenario: No match
- **WHEN** a player attempts to play a card that has a color, does not match `activeColor`, and does not match the top discard's symbol
- **THEN** the card is not playable

### Requirement: Active color tracking
The system SHALL maintain an `activeColor` field in the game state that represents the current color for matching.

#### Scenario: Active color set on normal card play
- **WHEN** a player plays a card with a color (number or action card)
- **THEN** `activeColor` is set to that card's color

#### Scenario: Active color set on wild card play
- **WHEN** a player plays a wild card with a chosen color
- **THEN** `activeColor` is set to the chosen color

#### Scenario: Active color on game start
- **WHEN** the game starts and the first discard card has a color
- **THEN** `activeColor` is set to that card's color

#### Scenario: Active color on wild first card
- **WHEN** the game starts and the first discard card is a wild (no color)
- **THEN** `activeColor` is set to `null`
- **AND** the first player may play any card

### Requirement: Skip card effect
The system SHALL apply the Skip effect when a Skip card is played.

#### Scenario: Skip card played
- **WHEN** a player plays a Skip card
- **THEN** the next player in the current direction is skipped
- **AND** `activeColor` is set to the Skip card's color

### Requirement: Reverse card effect
The system SHALL reverse the play direction when a Reverse card is played.

#### Scenario: Reverse card played
- **WHEN** a player plays a Reverse card
- **THEN** the `direction` value in game state is flipped (`1` becomes `-1`, `-1` becomes `1`)
- **AND** `activeColor` is set to the Reverse card's color

### Requirement: Draw Two card effect
The system SHALL force the next player to draw 2 cards when a Draw Two is played.

#### Scenario: Draw Two card played
- **WHEN** a player plays a Draw Two card
- **THEN** the host deals 2 cards from the deck to the next player
- **AND** those cards are added to the next player's hand in `dealtHandsMap`
- **AND** the next player's card count is incremented by 2
- **AND** the next player's turn is skipped
- **AND** `activeColor` is set to the Draw Two card's color

### Requirement: Draw card action
The system SHALL allow the current player to draw one card from the deck.

#### Scenario: Player draws a card
- **WHEN** the current player submits a `DRAW_CARD` action
- **THEN** the host removes one card from the top of the in-memory deck
- **AND** the card is added to the player's hand in `dealtHandsMap`
- **AND** the player's card count is incremented by 1
- **AND** the turn advances to the next player

#### Scenario: Draw when deck is empty
- **WHEN** the current player draws and the deck is empty
- **THEN** the host takes all cards from the discard pile except the top card
- **AND** shuffles them to form a new deck
- **AND** the draw proceeds from the new deck

#### Scenario: Draw when deck and discard are exhausted
- **WHEN** the deck is empty and the discard pile has only the top card
- **THEN** the draw action fails silently (player cannot draw)
- **AND** the turn still advances to the next player

### Requirement: Player card count tracking
The system SHALL maintain accurate card counts for all players in the shared game state.

#### Scenario: Card count decremented on play
- **WHEN** a player plays a card
- **THEN** their entry in `playerCardCounts` is decremented by 1

#### Scenario: Card count incremented on draw
- **WHEN** a player draws a card (or is forced to draw)
- **THEN** their entry in `playerCardCounts` is incremented by the number of cards drawn
