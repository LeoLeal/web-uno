# Spec: Game Session

## Purpose

Manages game session resilience including player disconnection detection, pause/resume flow, hand handover to replacement players, and win-by-walkover scenarios.

## Requirements

### Requirement: Player Disconnection Detection

The system SHALL detect player disconnections during gameplay by comparing active Yjs awareness states against the `lockedPlayers` list. Detection SHALL be performed by the host only. Non-host peers SHALL NOT execute disconnect detection logic or write pause status to the shared document.

When a potential disconnect is detected, the host SHALL wait a grace period of 5 seconds before confirming the disconnect and triggering a pause. If the missing player's awareness state reappears within the grace period, the disconnect SHALL be dismissed without pausing.

#### Scenario: Single player disconnects

- **WHEN** a player's awareness state disappears during `PLAYING` or `PAUSED_WAITING_PLAYER` status
- **AND** the number of active awareness peers with clientIds in `lockedPlayers` drops below the expected connected count (locked minus already-orphaned)
- **THEN** the host marks the missing player as a pending disconnect
- **AND** the host starts a 5-second grace period timer
- **AND** after the grace period expires, if the player is still absent from awareness, the host triggers the game pause flow

#### Scenario: Transient awareness flicker (no false positive)

- **WHEN** a player's awareness state briefly disappears due to heartbeat delay, network jitter, or browser throttling
- **AND** the player's awareness state reappears within the 5-second grace period
- **THEN** the pending disconnect is dismissed
- **AND** no pause is triggered
- **AND** gameplay continues uninterrupted

#### Scenario: Multiple players disconnect simultaneously

- **WHEN** two or more locked players lose awareness at the same time
- **THEN** the host tracks all missing players as pending disconnects under the same grace period timer
- **AND** after the grace period, any players still absent are confirmed as disconnected and tracked as orphans

#### Scenario: Non-locked player disconnects

- **WHEN** a peer who is NOT in `lockedPlayers` loses awareness (e.g., a late joiner observer)
- **THEN** no pause is triggered
- **AND** the game continues normally

#### Scenario: Non-host peer observes awareness mismatch

- **WHEN** a non-host peer's local awareness snapshot shows a locked player as absent
- **THEN** the non-host peer SHALL NOT write any status changes to the shared document
- **AND** the non-host peer SHALL NOT create orphan hand entries
- **AND** disconnect detection remains the sole responsibility of the host

### Requirement: Game Pause on Disconnection

The system SHALL pause the game when a locked player disconnects, setting status to `PAUSED_WAITING_PLAYER` and storing the previous status for later restoration.

#### Scenario: Transition to paused state from PLAYING
- **WHEN** the host detects a locked player disconnect during `PLAYING` status
- **THEN** the host sets `gameStateMap.statusBeforePause` to `PLAYING`
- **AND** the host sets `gameStateMap.status` to `PAUSED_WAITING_PLAYER`
- **AND** no turns progress while paused
- **AND** all players see the paused state

#### Scenario: Transition to paused state from ROUND_ENDED
- **WHEN** the host detects a locked player disconnect during `ROUND_ENDED` status
- **THEN** the host sets `gameStateMap.statusBeforePause` to `ROUND_ENDED`
- **AND** the host sets `gameStateMap.status` to `PAUSED_WAITING_PLAYER`

#### Scenario: Turn frozen during pause

- **WHEN** the disconnected player was the current turn holder
- **THEN** `currentTurn` remains set to the disconnected player's clientId
- **AND** no other player can take a turn

#### Scenario: Already paused when another disconnects

- **WHEN** the game is already in `PAUSED_WAITING_PLAYER` status
- **AND** an additional locked player disconnects
- **AND** the player is not already tracked in `orphanHands`
- **THEN** the new disconnect is added to orphan tracking
- **AND** the game remains paused

### Requirement: Orphan Hand Tracking

The system SHALL store disconnected players' hands as orphan hands in the Yjs `gameState` map for handover or removal.

#### Scenario: Orphan hand creation

- **WHEN** the host detects a player disconnect
- **THEN** the host reads the disconnected player's cards from the `dealtHands` Y.Map
- **AND** the host writes an entry to `orphanHands` in `gameState`: `{ originalClientId, originalName, cards }`
- **AND** the orphan hand is available for assignment to a replacement player

#### Scenario: Multiple orphan hands

- **WHEN** multiple players disconnect
- **THEN** each disconnected player has a separate entry in `orphanHands`
- **AND** entries are ordered by disconnection time

### Requirement: Player Replacement via Hand Handover

The system SHALL allow a new player joining during a pause to receive an orphaned hand, matched by name similarity. In multi-round games, the replacement player also inherits the original player's cumulative score. Replacement players bypass the MAX_PLAYERS limit because they fill existing orphan slots rather than adding new capacity.

#### Scenario: Replacement player joins during pause
- **WHEN** a new player joins the room while status is `PAUSED_WAITING_PLAYER`
- **AND** there are unassigned orphan hands
- **THEN** the host matches the new player to the closest orphan hand by Levenshtein name distance
- **AND** the orphan's cards are written to the new player's `dealtHands` entry
- **AND** the new player is added to `lockedPlayers` replacing the original player
- **AND** `turnOrder` is updated to replace the original clientId with the new clientId
- **AND** the orphan entry is removed from `orphanHands`
- **AND** this bypasses MAX_PLAYERS validation (filling an orphan slot, not adding capacity)

#### Scenario: Replacement player inherits cumulative score
- **WHEN** a replacement player takes over an orphaned seat in a multi-round game
- **AND** `gameStateMap.scores` exists
- **THEN** the host copies `scores[originalClientId]` to `scores[newClientId]`
- **AND** the host deletes `scores[originalClientId]`
- **AND** the updated scores map is written to `gameStateMap`

#### Scenario: All orphan hands assigned
- **WHEN** the last orphan hand is assigned to a replacement player
- **THEN** the host sets `gameState.status` to the value stored in `gameStateMap.statusBeforePause`
- **AND** `gameStateMap.statusBeforePause` is set to `null`
- **AND** gameplay or round-end state is restored

#### Scenario: Replacement inherits current turn

- **WHEN** the orphan being replaced was the current turn holder
- **AND** a replacement player takes over that hand
- **THEN** `currentTurn` is updated to the replacement player's clientId

### Requirement: Host Continue Without Player

The system SHALL allow the host to remove a disconnected player and continue the game without them. If removing a player would result in fewer than MIN_PLAYERS remaining, the game SHALL end instead with an appropriate message.

#### Scenario: Host removes disconnected player

- **WHEN** the host clicks "Continue without [player]" for an orphan hand
- **THEN** the orphan's cards are reshuffled into the host's deck
- **AND** the orphan entry is removed from `orphanHands`
- **AND** `playerCardCounts` is updated to remove the disconnected player
- **AND** the disconnected player's clientId is removed from `turnOrder`

#### Scenario: Removed player was current turn

- **WHEN** the removed player was the current turn holder
- **THEN** `currentTurn` advances to the next player in `turnOrder`

#### Scenario: All orphans resolved via removal
- **WHEN** the last orphan hand is removed (not replaced)
- **AND** at least MIN_PLAYERS remain
- **THEN** the host sets `gameState.status` to the value stored in `gameStateMap.statusBeforePause`
- **AND** `gameStateMap.statusBeforePause` is set to `null`

#### Scenario: Removal results in insufficient players

- **WHEN** the host removes a disconnected player via "Continue without"
- **AND** fewer than MIN_PLAYERS would remain after removal
- **THEN** the game ends immediately
- **AND** `gameState.status` is set to `ENDED`
- **AND** `gameState.endType` is set to "INSUFFICIENT_PLAYERS"
- **AND** `gameState.winner` is set to `null` (no winner)
- **AND** all players see a "Not enough players to continue" message

