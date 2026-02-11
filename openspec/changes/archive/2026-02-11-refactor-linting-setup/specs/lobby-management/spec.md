## MODIFIED Requirements

### Requirement: Modal Component Lifecycle

Modal components (`GameSettingsModal`, `HostDisconnectModal`) SHALL be conditionally rendered by their parent components, mounting only when they need to be visible. This ensures state resets naturally via `useState` initializers without `useEffect` synchronization.

#### Scenario: GameSettingsModal opens

- **WHEN** the host clicks "Configure" in `GameSettingsPanel`
- **THEN** `GameSettingsModal` mounts with `draft` initialized from `currentSettings`
- **WHEN** the modal is closed
- **THEN** `GameSettingsModal` unmounts completely

#### Scenario: HostDisconnectModal appears

- **WHEN** `isHostConnected` becomes `false`
- **THEN** `HostDisconnectModal` mounts with `countdown` initialized to `5`
- **WHEN** the countdown reaches 0
- **THEN** the user is navigated to the homepage
