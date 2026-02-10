# Spec: P2P Networking (Delta)

## Purpose

Extended networking requirements for hand distribution and public game state sync.

## ADDED Requirements

### Requirement: Hand Distribution via Yjs

The system SHALL distribute dealt hands to all players via a Yjs `dealtHands` Y.Map, keyed by player clientId.

#### Scenario: Host deals hands

- **WHEN** the host starts the game and deals cards
- **THEN** the host writes each player's hand to `dealtHands` Y.Map keyed by `String(clientId)`
- **AND** all writes happen in a single Yjs transaction along with other game state updates

#### Scenario: Player receives hand

- **WHEN** a player's `usePlayerHand` hook observes the `dealtHands` map
- **AND** an entry matching their `clientId` is set
- **THEN** they store the cards in local state
- **AND** the cards are displayed in their hand UI

> **Note:** Hands are in shared Yjs state, so a peer with dev tools could inspect other players' hands. Acceptable for friendly games. A future enhancement will add privacy (per-player encryption or separate data channel).

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
