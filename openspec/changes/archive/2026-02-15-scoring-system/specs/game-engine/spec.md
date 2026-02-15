## ADDED Requirements

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

## MODIFIED Requirements

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
