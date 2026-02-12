## ADDED Requirements

### Requirement: Player Disconnection Detection and Game Pause

The system must detect when a player disconnects during an active game and pause the game state to prevent progress until resolved.

#### Scenario: Active Player Disconnects

- **WHEN** a player's presence is lost from the P2P awareness state AND the game status is `PLAYING`
- **THEN** the game status transitions to `PAUSED_WAITING_PLAYER`
- **AND** the disconnected player's hand is marked as an "orphan hand" associated with their original client ID and name
- **AND** a modal is displayed to all remaining players indicating the game is paused and waiting for the player

### Requirement: Player Reconnection and Handover

The system must allow a disconnected player (or a new player with a similar name) to rejoin and reclaim their hand seamlessly.

#### Scenario: Player Rejoins via Name Match

- **WHEN** a new player joins a game in `PAUSED_WAITING_PLAYER` status
- **AND** their name matches (fuzzy match or exact) an essentially orphaned hand
- **THEN** the orphaned hand is assigned to the new player
- **AND** the player is re-seated at the correct position
- **AND** if all orphaned hands are reclaimed, the game status transitions back to `PLAYING`

### Requirement: Host Management of Disconnected Players

The host must have the ability to forcibly remove a disconnected player to allow the game to continue with fewer players.

#### Scenario: Host Continues Without Player

- **WHEN** the game is in `PAUSED_WAITING_PLAYER` status
- **AND** the host selects the "Continue without [Player]" option
- **THEN** the orphaned hand is returned to the deck (reshuffled)
- **AND** the game player count is reduced
- **AND** if it was the disconnected player's turn, the turn advances to the next active player
- **AND** if all remaining inconsistencies are resolved, the game status transitions back to `PLAYING`

### Requirement: Win by Walkover

The system must declare a winner if all other opponents disconnect.

#### Scenario: All Opponents Disconnect

- **WHEN** all players except one have disconnected
- **THEN** the game status transitions to `ENDED`
- **AND** the remaining player is declared the winner
- **AND** a "Win by Walkover" notification is displayed
