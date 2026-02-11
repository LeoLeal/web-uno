# Spec: P2P Networking

## Purpose

Handles the underlying WebRTC connections, Yjs provider setup, and ephemeral messaging between peers.

## Requirements

### Requirement: Yjs Provider Initialization

The system SHALL initialize a `y-webrtc` provider using the Room ID as the signaling channel and the configured signaling URL.

#### Scenario: Provider connection

- **WHEN** the room component mounts
- **THEN** a `WebrtcProvider` is instantiated with the Room ID
- **THEN** the provider connects to the URL specified in `NEXT_PUBLIC_SIGNALING_URL` (defaulting to `ws://localhost:4444`)

### Requirement: Host Identification via Shared State

The system SHALL store the Host identity in the shared Yjs document state. All peers SHALL read from this shared state to determine who is the Host.

#### Scenario: First peer claims host via shared state

- **WHEN** the first peer connects to an empty room
- **THEN** they check the shared `gameState` for `hostId`
- **THEN** if `hostId` is null, they set it to their client ID
- **THEN** they become the Host

#### Scenario: Late joiner reads existing host from state

- **WHEN** a late joiner connects to a room
- **THEN** they read `hostId` from shared `gameState`
- **THEN** they see it is already set to another peer's ID
- **THEN** they do NOT modify `hostId` and become a Guest

#### Scenario: Concurrent join resolution

- **WHEN** two peers join simultaneously
- **THEN** both may attempt to set `hostId`
- **THEN** Yjs resolves the conflict (last-write-wins or CRDT merge)
- **THEN** All peers eventually agree on a single Host

#### Scenario: Host identity consistency

- **WHEN** any peer checks who is Host
- **THEN** they read `hostId` from shared state
- **THEN** they compare it with each peer's clientId
- **THEN** the matching peer is identified as Host

### Requirement: Connection Status

The system SHALL track and display the connection status of peers via Yjs Awareness.

#### Scenario: Peer disconnects

- **WHEN** a peer closes their tab
- **THEN** the Yjs awareness protocol updates to remove them from the active list
- **THEN** the UI updates to show them as disconnected or removes them

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

### Requirement: Awareness State Type Safety

The `useRoom` hook SHALL use proper TypeScript types when accessing awareness local state, using `{ user?: Partial<Omit<Player, 'clientId'>> } | null` instead of `any`.

### Requirement: Client ID Sync

Setting `myClientId` from the WebRTC awareness `clientID` within an effect is a legitimate pattern for syncing state from an external system and MAY use an `eslint-disable` comment.
