# Spec: P2P Networking (Delta)

## Purpose

Extended networking requirements for private hand distribution via WebRTC broadcast messaging.

## ADDED Requirements

### Requirement: Private Hand Distribution

The system SHALL send each player's hand via WebRTC broadcast with recipient filtering, not through shared Yjs state.

#### Scenario: Host sends hand to guest

- **WHEN** the host deals cards to a guest player
- **THEN** the host broadcasts a `DEAL_HAND` message to all connected peers
- **AND** the message contains `toClientId` specifying the intended recipient
- **AND** the message contains only that player's cards (not other players' cards)

#### Scenario: Guest receives hand

- **WHEN** a guest receives a `DEAL_HAND` message
- **AND** the message's `toClientId` matches their Yjs awareness `clientId`
- **THEN** they store the cards in local state
- **AND** the cards are displayed in their hand UI

#### Scenario: Guest ignores others' hands

- **WHEN** a guest receives a `DEAL_HAND` message
- **AND** the message's `toClientId` does NOT match their `clientId`
- **THEN** they ignore the message

> **Note:** This is not cryptographically private. A sophisticated attacker with dev tools could observe all dealt hands. Acceptable for friendly games; encryption can be added in a future change.

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

### Requirement: Game Message Protocol

The system SHALL define a message protocol for game-specific peer communication that coexists with y-webrtc sync messages.

#### Scenario: Message framing

- **WHEN** sending a game message via WebRTC
- **THEN** the message is prefixed with byte `0xFF` to distinguish from y-webrtc sync protocol
- **AND** the remainder is JSON-encoded payload

#### Scenario: Message format

- **WHEN** constructing a game message payload
- **THEN** the JSON object includes:
  - `type`: message kind (e.g., `DEAL_HAND`) — required
  - `toClientId`: Yjs awareness clientId of recipient — required
  - `cards`: array of Card objects (for `DEAL_HAND`) — type-specific payload

#### Scenario: Message reception

- **WHEN** a peer receives data on the WebRTC connection
- **AND** the first byte is `0xFF`
- **THEN** the peer parses the remainder as a game message
- **AND** filters by `toClientId` before processing

#### Scenario: Non-game messages pass through

- **WHEN** a peer receives data on the WebRTC connection
- **AND** the first byte is NOT `0xFF`
- **THEN** y-webrtc handles the message normally (Yjs sync/awareness)

### Requirement: Lobby Lock

The system SHALL lock the player list when the game starts and reject late joiners.

#### Scenario: Lock player list on game start

- **WHEN** the host starts the game
- **THEN** the system stores `lockedPlayers` array in Yjs shared state
- **AND** each entry contains `{ clientId, name }` for all current players
- **AND** the locked player count is the length of this array

#### Scenario: Late joiner detection

- **WHEN** a new peer connects to the room
- **AND** the game status is `PLAYING`
- **AND** the peer's clientId is NOT in `lockedPlayers`
- **THEN** the peer is considered a "late joiner"

#### Scenario: Late joiner rejection

- **WHEN** a late joiner is detected
- **THEN** the late joiner sees a modal: "Game Already Started - You cannot join this game"
- **AND** the modal has a button to return to the home page
- **AND** the late joiner is NOT added to the game

> **Note:** The late joiner's awareness state may briefly appear before rejection. Client-side filtering handles this.
