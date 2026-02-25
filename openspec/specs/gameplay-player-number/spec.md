# Spec: Gameplay Player Number

## Purpose

Define gameplay UI requirements for showing each player's stable turn-order position.

## Requirements

### Requirement: Opponent Player Number Badge

The system SHALL display a small numbered circle at the top-left of each opponent's avatar during gameplay, indicating their position in the turn order.

#### Scenario: Badge display

- **WHEN** the game is in a gameplay state (`PLAYING`, `PAUSED_WAITING_PLAYER`, `ROUND_ENDED`, or `ENDED`)
- **THEN** each opponent's avatar SHALL display a small circle at its top-left corner containing their turn order position (1-indexed)

#### Scenario: Badge default appearance

- **WHEN** it is NOT the opponent's turn
- **THEN** the badge SHALL have a subtle appearance (dark background, muted text, copper border)

#### Scenario: Badge lights up on current turn

- **WHEN** it IS the opponent's turn (their clientId matches `currentTurn`)
- **THEN** the badge SHALL have a highlighted appearance (yellow/gold background, dark text, glow effect)
- **AND** this SHALL reinforce the existing golden ring turn indicator

### Requirement: Player Number Label

The system SHALL display a centered label below the player's hand during gameplay indicating their position in the turn order.

#### Scenario: Label display

- **WHEN** the game is in a gameplay state
- **THEN** a label "You are player number N" SHALL be displayed centered below the player's card fan
- **AND** N is the player's 1-indexed position in the `turnOrder`

#### Scenario: Number stability during game

- **WHEN** a player's number is assigned at game start
- **THEN** the number SHALL remain stable throughout the game session
- **AND** replacement players (handover) SHALL inherit the original player's number

### Requirement: Player Number Computation

The system SHALL compute player numbers from the locked `turnOrder` array.

#### Scenario: Number derivation

- **WHEN** computing player numbers during gameplay
- **THEN** each player's number SHALL be `turnOrder.indexOf(clientId) + 1`
- **AND** numbers SHALL be passed as props from `GameBoard` to `OpponentRow`/`OpponentIndicator` and `PlayerHand`
