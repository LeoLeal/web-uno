# Spec: Gameplay Actions

## Purpose

Defines the action queue system for Uno gameplay - how players submit actions (play card, draw card) and how the host validates and executes them.

## Requirements

### Requirement: Player action types

The system SHALL define a `PlayerAction` discriminated union for all actions a player can submit.

#### Scenario: Play card action

- **WHEN** a player wants to play a card
- **THEN** they submit `{ type: 'PLAY_CARD', cardId: string }`
- **AND** `cardId` references a card in their hand

#### Scenario: Play wild card action with color

- **WHEN** a player wants to play a wild card
- **THEN** they submit `{ type: 'PLAY_CARD', cardId: string, chosenColor: CardColor }`
- **AND** `chosenColor` is one of `'red' | 'blue' | 'green' | 'yellow'`

#### Scenario: Draw card action

- **WHEN** a player wants to draw a card from the deck
- **THEN** they submit `{ type: 'DRAW_CARD' }`

### Requirement: Actions map in Yjs document

The system SHALL store player actions in a Yjs shared map called `actionsMap`.

#### Scenario: Action map structure

- **WHEN** a player submits an action
- **THEN** the action is written to `actionsMap` keyed by `String(clientId)`
- **AND** each player can only write their own key

#### Scenario: Action cleared after processing

- **WHEN** the host processes an action (valid or invalid)
- **THEN** the host sets the player's `actionsMap` entry to `null`

### Requirement: Action submission hook

The system SHALL provide a `useGamePlay` hook for players to submit actions and perform local pre-validation.

#### Scenario: Submit action

- **WHEN** a player calls `submitAction(action)`
- **THEN** the action is written to `actionsMap[String(myClientId)]`

#### Scenario: Local card playability check

- **WHEN** a player calls `canPlayCard(card)`
- **THEN** the function returns `true` if:
  - The top discard card has no color (any card is playable), OR
  - The card has no color (wild card), OR
  - The card's color matches the top discard card's color, OR
  - The card's symbol matches the top discard card's symbol
- **AND** returns `false` otherwise

#### Scenario: Turn awareness

- **WHEN** a player reads `isMyTurn` from the hook
- **THEN** it returns `true` only when `currentTurn === myClientId` and the game is not frozen

### Requirement: Host action observation

The system SHALL have the host observe the `actionsMap` for new player actions.

#### Scenario: Host detects new action

- **WHEN** a player writes an action to `actionsMap`
- **THEN** the host's observer fires
- **AND** the host reads the action for the player whose entry changed

#### Scenario: Host ignores null entries

- **WHEN** the host observes an `actionsMap` change with a `null` value
- **THEN** the host does not process it (null means cleared/consumed)

### Requirement: Host action validation

The system SHALL validate all player actions before execution.

#### Scenario: Turn validation

- **WHEN** the host receives an action from a player
- **THEN** the host checks that it is currently that player's turn
- **AND** rejects the action if it is not their turn

#### Scenario: Card ownership validation

- **WHEN** the host receives a `PLAY_CARD` action
- **THEN** the host checks that the player's hand (in `dealtHandsMap`) contains the referenced `cardId`
- **AND** rejects the action if the card is not in their hand

#### Scenario: Card playability validation

- **WHEN** the host receives a `PLAY_CARD` action
- **THEN** the host checks that the card is playable against the current discard top card
- **AND** rejects the action if the card cannot be played

#### Scenario: Wild card color validation

- **WHEN** the host receives a `PLAY_CARD` action for a wild card
- **THEN** the host checks that `chosenColor` is present and is a valid `CardColor`
- **AND** rejects the action if `chosenColor` is missing or invalid

#### Scenario: Invalid action handling

- **WHEN** the host determines an action is invalid
- **THEN** the host clears the action from `actionsMap` (sets to `null`)
- **AND** no game state changes occur
- **AND** no explicit rejection message is sent to the player

### Requirement: Host action execution

The system SHALL execute valid actions atomically in a Yjs transaction.

#### Scenario: Atomic state update

- **WHEN** the host executes a valid action
- **THEN** all resulting state changes are wrapped in a single `doc.transact()` call
- **AND** peers see all changes atomically (no partial updates)

#### Scenario: Play card execution

- **WHEN** the host executes a valid `PLAY_CARD` action
- **THEN** the card is removed from the player's hand in `dealtHandsMap`
- **AND** the card is added to the discard pile in `gameStateMap`
- **AND** the player's card count is updated in `playerCardCounts`
- **AND** card effects are applied (if action card)
- **AND** the turn is advanced (unless win detected)
- **AND** the action is cleared from `actionsMap`

#### Scenario: Draw card execution

- **WHEN** the host executes a valid `DRAW_CARD` action
- **THEN** one card is removed from the host's in-memory deck
- **AND** the card is added to the player's hand in `dealtHandsMap`
- **AND** the player's card count is incremented in `playerCardCounts`
- **AND** the action is cleared from `actionsMap`

### Requirement: Force Play draw validation

The system SHALL reject `DRAW_CARD` actions when the Force Play house rule is enabled and the player has a playable card.

#### Scenario: Draw rejected when playable card exists

- **WHEN** the host receives a `DRAW_CARD` action
- **AND** the Force Play setting is enabled
- **AND** the player's hand contains at least one playable card
- **THEN** the host SHALL reject the action (clear from `actionsMap`)
- **AND** no game state changes occur

#### Scenario: Draw allowed when no playable card exists

- **WHEN** the host receives a `DRAW_CARD` action
- **AND** the Force Play setting is enabled
- **AND** the player's hand contains no playable cards
- **THEN** the host SHALL execute the draw normally

#### Scenario: Draw unaffected when Force Play is disabled

- **WHEN** the host receives a `DRAW_CARD` action
- **AND** the Force Play setting is disabled (default)
- **THEN** the host SHALL execute the draw normally regardless of hand contents

### Requirement: Client-side draw availability

The `useGamePlay` hook SHALL expose a `canDraw` boolean reflecting whether the current player is allowed to draw.

#### Scenario: canDraw when Force Play disabled

- **WHEN** the Force Play setting is disabled
- **THEN** `canDraw` SHALL be `true`

#### Scenario: canDraw when Force Play enabled and no playable card

- **WHEN** the Force Play setting is enabled
- **AND** the player's hand has no playable cards
- **THEN** `canDraw` SHALL be `true`

#### Scenario: canDraw when Force Play enabled and playable card exists

- **WHEN** the Force Play setting is enabled
- **AND** the player's hand has at least one playable card
- **THEN** `canDraw` SHALL be `false`
