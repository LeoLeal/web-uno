# Spec: Game Engine

## Purpose

Core game state management for Uno: deck creation, shuffling, dealing hands, and turn order initialization.

## Requirements

### Requirement: Deck Creation

The system SHALL create a standard 108-card Uno deck with the correct card distribution.

#### Scenario: Deck composition

- **WHEN** the game is initialized
- **THEN** the deck contains:
  - 76 number cards (0-9 in 4 colors, one 0 per color, two of 1-9 per color)
  - 24 action cards (Skip, Reverse, Draw Two: 2 each per color)
  - 8 wild cards (4 Wild, 4 Wild Draw Four)

### Requirement: Deck Shuffling

The system SHALL shuffle the deck randomly before dealing.

#### Scenario: Shuffled deck

- **WHEN** the game starts
- **THEN** the deck order is randomized using Fisher-Yates shuffle
- **AND** each game produces a different card order

### Requirement: Hand Dealing

The system SHALL deal the configured number of cards to each player when the game starts.

#### Scenario: Initial deal

- **WHEN** the host starts the game with N players and starting hand size H
- **THEN** the host removes H×N cards from the deck
- **AND** each player receives exactly H cards
- **AND** the remaining deck size is 108 - (H×N) - 1 (minus the first discard)

#### Scenario: Host deals to all players

- **WHEN** the host deals cards
- **THEN** all players' hands (including the host's own) are written to the Yjs `dealtHands` map
- **AND** each entry is keyed by `String(clientId)`
- **AND** all hand entries are written in a single Yjs transaction

### Requirement: First Card Flip

The system SHALL flip the top card of the deck to start the discard pile.

#### Scenario: Normal first card

- **WHEN** the top card is a number card or action card
- **THEN** that card becomes the first card of the discard pile

#### Scenario: Wild Draw Four as first card

- **WHEN** the top card is a Wild Draw Four
- **THEN** the card is returned to the deck
- **AND** the deck is reshuffled
- **AND** a new top card is drawn

#### Scenario: Regular Wild as first card

- **WHEN** the top card is a regular Wild (not Wild Draw Four)
- **THEN** that card becomes the first card of the discard pile
- **AND** the wild card is treated as having no active color

> **Note:** Color assignment for a wild first card is out of scope for this change. The first player will set the color when they play (future change).

### Requirement: Turn Order Initialization

The system SHALL establish a turn order based on connected players.

#### Scenario: Turn order set

- **WHEN** the game starts
- **THEN** turn order is set based on the lobby player list order
- **AND** the first player in the list takes the first turn
- **AND** play direction is set to clockwise (forward)

### Requirement: Host-Only Deck State

The system SHALL store the deck only in the host's memory, never in shared state.

#### Scenario: Deck privacy

- **WHEN** any peer inspects the shared Yjs state
- **THEN** they cannot see the deck contents or order
- **THEN** only the top of the discard pile is visible

#### Scenario: Deck persists through gameplay
- **WHEN** the game is in PLAYING status
- **THEN** the host's in-memory deck is used for all draw operations
- **AND** the deck count decreases as cards are drawn
- **AND** the deck is replenished by reshuffling the discard pile when empty

### Requirement: Host action processing loop

The system SHALL observe the Yjs `actionsMap` and process player actions when the host is running the game engine.

#### Scenario: Host registers observer on game start
- **WHEN** the game transitions to `PLAYING` status and the current player is the host
- **THEN** the host registers an observer on the `actionsMap` Yjs map
- **AND** the observer fires whenever any player writes an action

#### Scenario: Host processes one action at a time
- **WHEN** the host's observer detects a new action
- **THEN** the host reads the action, validates it, and either executes or rejects it
- **AND** the action is cleared from `actionsMap` after processing

#### Scenario: Host ignores actions during non-playing statuses
- **WHEN** the host's observer fires and the game status is `ROUND_ENDED`, `ENDED`, or `PAUSED_WAITING_PLAYER`
- **THEN** the host does not process the action

### Requirement: Round initialization

The system SHALL support starting a new round in a multi-round game, resetting transient state while preserving persistent state.

#### Scenario: New round resets deck and hands
- **WHEN** the host triggers a new round during `ROUND_ENDED` status
- **THEN** a new 108-card deck is created and shuffled
- **AND** cards are dealt to all players in `lockedPlayers` using the configured `startingHandSize`
- **AND** a first card is flipped for the discard pile (with Wild Draw Four reshuffle rule)
- **AND** first-card effects are applied (Skip, Reverse, Draw Two, Wild)

#### Scenario: New round preserves multi-round state
- **WHEN** the host initializes a new round
- **THEN** `turnOrder` is preserved (same players in same order)
- **AND** `lockedPlayers` is preserved
- **AND** `scores` is preserved (not reset)
- **AND** `currentRound` is incremented by 1

#### Scenario: New round resets transient state
- **WHEN** the host initializes a new round
- **THEN** `discardPile` is set to the new first card
- **AND** `playerCardCounts` is reset to the configured `startingHandSize` for each player
- **AND** `direction` is reset to `1` (clockwise) before first-card effects
- **AND** `orphanHands` is set to an empty array
- **AND** `actionsMap` is cleared
- **AND** the host's in-memory deck is replaced with the new deck

#### Scenario: New round rotates starting player
- **WHEN** the host initializes round N
- **THEN** `currentTurn` is set to `turnOrder[(N - 1) % turnOrder.length]` before first-card effects
- **AND** first-card effects may modify the starting player (e.g., Skip skips them)

#### Scenario: New round transitions to PLAYING
- **WHEN** all round initialization is complete
- **THEN** `gameStateMap.status` is set to `PLAYING`
- **AND** all state changes are written in a single Yjs transaction

### Requirement: Host manages all hand mutations

The system SHALL have the host as the sole writer of player hands during gameplay.

#### Scenario: Card removal on play
- **WHEN** a card play is validated and executed
- **THEN** the host removes the card from the player's entry in `dealtHandsMap`
- **AND** the host writes the updated hand array in the same transaction

#### Scenario: Card addition on draw
- **WHEN** a draw action is executed (player draw or forced draw from action cards)
- **THEN** the host adds the card(s) to the target player's entry in `dealtHandsMap`
- **AND** the host writes the updated hand array in the same transaction

### Requirement: Host manages deck during gameplay

The system SHALL have the host manage the in-memory deck for all draw operations during gameplay.

#### Scenario: Cards drawn from deck
- **WHEN** any draw operation occurs (player draw, Draw Two, Wild Draw Four)
- **THEN** cards are popped from the host's in-memory `deckRef`
- **AND** the deck is never exposed to shared Yjs state

#### Scenario: Deck reshuffle from discard
- **WHEN** the deck is empty and a draw is needed
- **THEN** the host takes all discard pile cards except the top card
- **AND** shuffles them using Fisher-Yates
- **AND** uses the shuffled cards as the new deck

### Requirement: Host updates game state atomically

The system SHALL wrap all game state changes from a single action in one Yjs transaction.

#### Scenario: Play card transaction
- **WHEN** the host executes a card play
- **THEN** the following are updated in a single `doc.transact()`:
  - Player's hand in `dealtHandsMap`
  - Discard pile in `gameStateMap`
  - `playerCardCounts` in `gameStateMap`
  - `currentTurn` in `gameStateMap`
  - `direction` in `gameStateMap` (if Reverse)
  - Target player's hand in `dealtHandsMap` (if Draw Two or Wild Draw Four)
  - Target player's card count in `playerCardCounts` (if Draw Two or Wild Draw Four)
  - `status` and `winner` in `gameStateMap` (if win detected)
  - Player's action in `actionsMap` (cleared to null)

### Requirement: First discard card effects

The system SHALL apply the appropriate effect when the first card flipped from the deck is an action or wild card. Wild Draw Four is the only card that triggers a reshuffle; all other action cards have their effects applied at game start.

#### Scenario: First card is a number card
- **WHEN** the first card flipped from the deck is a number card (0-9)
- **THEN** no special effect is applied
- **AND** the first player in `turnOrder` takes their turn with direction `1`

#### Scenario: First card is a Skip
- **WHEN** the first card flipped from the deck is a Skip card
- **THEN** the first player in `turnOrder` is skipped
- **AND** the turn starts with the second player in `turnOrder`

#### Scenario: First card is a Reverse
- **WHEN** the first card flipped from the deck is a Reverse card
- **THEN** the direction is set to `-1` (counter-clockwise)
- **AND** the turn starts with the last player in `turnOrder`

#### Scenario: First card is a Draw Two
- **WHEN** the first card flipped from the deck is a Draw Two card
- **THEN** the first player in `turnOrder` is dealt 2 cards from the deck
- **AND** the first player's card count is incremented by 2
- **AND** the first player's turn is skipped
- **AND** the turn starts with the second player in `turnOrder`

#### Scenario: First card is a Wild
- **WHEN** the first card flipped from the deck is a Wild card
- **THEN** the card remains on the discard pile with no color assigned
- **AND** the first player may play any card (null active color means any color matches)

#### Scenario: First card is a Wild Draw Four
- **WHEN** the first card flipped from the deck is a Wild Draw Four
- **THEN** the card is returned to the deck
- **AND** the deck is reshuffled
- **AND** a new card is flipped from the deck
- **AND** this process repeats until the first card is not a Wild Draw Four

### Requirement: Forced draw with insufficient deck

The system SHALL deal as many cards as available when a forced draw cannot be fully fulfilled.

#### Scenario: Forced draw with partially exhausted deck
- **WHEN** a Draw Two or Wild Draw Four effect requires dealing cards
- **AND** the deck has fewer cards than required even after reshuffling the discard pile
- **THEN** the host deals as many cards as are available from the deck
- **AND** the target player's card count is incremented by the number of cards actually dealt
- **AND** the target player's turn is still skipped
