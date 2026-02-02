## MODIFIED Requirements

### Requirement: Host Presence Monitoring
The system SHALL continuously monitor the Host's presence in the P2P mesh.

#### Scenario: Monitor host via awareness
- **WHEN** any peer is in a room
- **THEN** they periodically check if the hostId peer is in awareness.getStates()
- **THEN** if host is missing for >3 seconds, trigger disconnection event

#### Scenario: Awareness state tracking
- **WHEN** awareness changes (peers join/leave)
- **THEN** re-check host presence immediately
- **THEN** update UI if host status changed
