## ADDED Requirements

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
  - `activeColor` in `gameStateMap`
  - `playerCardCounts` in `gameStateMap`
  - `currentTurn` in `gameStateMap`
  - `direction` in `gameStateMap` (if Reverse)
  - Target player's hand in `dealtHandsMap` (if Draw Two or Wild Draw Four)
  - Target player's card count in `playerCardCounts` (if Draw Two or Wild Draw Four)
  - `status` and `winner` in `gameStateMap` (if win detected)
  - Player's action in `actionsMap` (cleared to null)

## MODIFIED Requirements

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
