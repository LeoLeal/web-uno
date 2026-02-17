## ADDED Requirements

### Requirement: Host Presence Confirmation for Lobby Modals
The system SHALL treat host identity and host presence as separate concerns during room bootstrap. Host-disconnect UI SHALL be shown either after known-host absence is confirmed or after unresolved host identity remains undefined beyond a 3-second grace period.

#### Scenario: Unresolved host identity during guest bootstrap
- **WHEN** a guest joins a room and host identity is not yet resolved from shared state
- **THEN** the system treats host identity as unresolved
- **AND** the system does NOT mark the host as disconnected
- **AND** the Join Game modal remains eligible to open

#### Scenario: Unresolved host identity times out
- **WHEN** host identity remains `undefined` for at least 3 seconds after bootstrap
- **THEN** the system treats the room as host-disconnected
- **AND** the Host Disconnect modal is displayed

#### Scenario: Known host is absent
- **WHEN** host identity is resolved to a concrete host client ID
- **AND** that host is confirmed absent from awareness
- **THEN** the system marks host presence as disconnected
- **AND** the Host Disconnect modal is displayed

## MODIFIED Requirements

### Requirement: Host Claiming
The system SHALL ensure the user who created the room becomes the Host, regardless of connection order or network latency. During bootstrap, host identity SHALL be represented as tri-state: `undefined` (unresolved), `null` (resolved but unclaimed), or `number` (resolved host client ID).

#### Scenario: Creator claims host
- **WHEN** a user navigates to a room and `sessionStorage` contains a `room-creator` value matching the room ID
- **THEN** they claim Host status immediately upon room initialization
- **AND** host identity resolves to their client ID (`number` state)
- **AND** the `sessionStorage` entry is cleared to prevent re-claiming on reload

#### Scenario: Guest does not claim host
- **WHEN** a user navigates to a room WITHOUT the `room-creator` sessionStorage entry
- **THEN** they do NOT claim Host status immediately
- **THEN** host identity remains `undefined` until synchronization resolves it to `null` or a host client ID
- **BUT** they are marked as "Synced" (UI unblocked) to allow interaction

### Requirement: Player Name Input
The system SHALL prompt ALL players for their name upon joining, including the Host. Unresolved host identity SHALL NOT block the name prompt during the 3-second unresolved-host grace period.

#### Scenario: Room creator enters name
- **WHEN** a user creates a room and becomes Host
- **THEN** they see the "Join Game" modal to enter their name
- **WHEN** they enter "Alice"
- **THEN** their display name becomes "Alice" with Host privileges

#### Scenario: Guest enters name before host state fully resolves
- **WHEN** a guest joins a room and has not yet entered a name
- **AND** host identity is unresolved
- **THEN** they still see the "Join Game" modal to enter their name
- **WHEN** they enter "Bob"
- **THEN** their display name becomes "Bob"

### Requirement: Modal Component Lifecycle
Modal components (`GameSettingsModal`, `HostDisconnectModal`) SHALL be conditionally rendered by their parent components, mounting only when they need to be visible. This ensures state resets naturally via `useState` initializers without `useEffect` synchronization.

#### Scenario: GameSettingsModal opens
- **WHEN** the host clicks "Configure" in `GameSettingsPanel`
- **THEN** `GameSettingsModal` mounts with `draft` initialized from `currentSettings`
- **WHEN** the modal is closed
- **THEN** `GameSettingsModal` unmounts completely

#### Scenario: HostDisconnectModal appears only on confirmed disconnection
- **WHEN** host identity is resolved to a concrete host client ID
- **AND** host presence is confirmed disconnected
- **THEN** `HostDisconnectModal` mounts with `countdown` initialized to `5`
- **WHEN** the countdown reaches 0
- **THEN** the user is navigated to the homepage

#### Scenario: HostDisconnectModal appears after unresolved-host timeout
- **WHEN** host identity stays `undefined` for at least 3 seconds
- **THEN** `HostDisconnectModal` mounts with `countdown` initialized to `5`
- **WHEN** the countdown reaches 0
- **THEN** the user is navigated to the homepage
