## MODIFIED Requirements

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
