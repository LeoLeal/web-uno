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
