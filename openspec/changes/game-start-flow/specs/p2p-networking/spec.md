# Spec: P2P Networking (Delta)

## Purpose

Extended networking requirements for private hand distribution via WebRTC data channels.

## ADDED Requirements

### Requirement: Private Hand Distribution

The system SHALL send each player's hand privately via WebRTC data channel, not through shared Yjs state.

#### Scenario: Host sends hand to guest

- **WHEN** the host deals cards to a guest player
- **THEN** the host sends a `DEAL_HAND` message via WebRTC data channel
- **AND** the message contains only that player's cards (not other players' cards)
- **AND** the message is sent only to that specific peer

#### Scenario: Guest receives hand

- **WHEN** a guest receives a `DEAL_HAND` message
- **THEN** they store the cards in local state
- **AND** the cards are displayed in their hand UI
- **AND** other players cannot see these cards

### Requirement: Public Game State Sync

The system SHALL sync public game state (discard pile, turn, card counts) via Yjs shared document.

#### Scenario: Public state fields

- **WHEN** the game state is updated
- **THEN** the following are synced via Yjs `gameState` map:
  - `currentTurn`: clientId of whose turn it is
  - `direction`: play direction (1 or -1)
  - `discardPile`: array of visible discard cards
  - `playerCardCounts`: map of clientId to card count
  - `turnOrder`: ordered array of player clientIds

#### Scenario: All peers see same state

- **WHEN** any peer reads the public game state
- **THEN** they see the same discard pile top card
- **AND** they see the same current turn indicator
- **AND** they see correct card counts for all players

### Requirement: Private Message Protocol

The system SHALL define a message protocol for private peer-to-peer communication.

#### Scenario: Message format

- **WHEN** sending a private message
- **THEN** the message includes `type`, `payload`, and optional `recipientId`
- **AND** the `type` field identifies the message kind (e.g., `DEAL_HAND`)

#### Scenario: Message types for game start

- **WHEN** starting the game
- **THEN** the host uses `DEAL_HAND` message type
- **AND** the payload contains an array of Card objects with id, color, and symbol
