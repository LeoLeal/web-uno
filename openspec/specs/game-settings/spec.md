## ADDED Requirements

### Requirement: Game settings type definition

The system SHALL define a GameSettings interface with all configurable options.

#### Scenario: Settings interface includes all options

- **WHEN** the GameSettings type is used
- **THEN** it includes `startingHandSize` with values 5, 7, or 10
- **AND** it includes `scoreLimit` with values 100, 200, 300, 500, or null
- **AND** it includes boolean flags: `drawStacking`, `jumpIn`, `zeroSwap`, `sevenSwap`, `forcePlay`, `multipleCardPlay`

### Requirement: Default settings configuration

The system SHALL provide a DEFAULT_SETTINGS constant representing standard Uno rules.

#### Scenario: Default values match standard rules

- **WHEN** DEFAULT_SETTINGS is accessed
- **THEN** `startingHandSize` is 7
- **AND** `scoreLimit` is null (single round)
- **AND** all boolean flags are false

### Requirement: Settings descriptions for tooltips

The system SHALL provide human-readable descriptions for each setting.

#### Scenario: Each setting has a description

- **WHEN** tooltip content is needed for a setting
- **THEN** a description is available that explains the setting's effect
- **AND** descriptions are concise and user-friendly

### Requirement: Settings stored in Yjs document

The system SHALL store game settings in the Yjs shared document for P2P synchronization.

#### Scenario: Settings map exists in document

- **WHEN** the game room is initialized
- **THEN** a 'gameSettings' map exists in the Yjs document

#### Scenario: Settings sync to all peers

- **WHEN** the host updates a setting
- **THEN** all connected peers receive the updated setting via Yjs replication

### Requirement: Host initializes default settings

The system SHALL initialize settings with defaults when the host creates a room.

#### Scenario: New room has default settings

- **WHEN** a host creates a new room
- **THEN** the gameSettings map is populated with DEFAULT_SETTINGS values

### Requirement: Settings hook for reading

The system SHALL provide a hook for components to read current settings.

#### Scenario: Hook returns current settings

- **WHEN** a component uses the settings hook
- **THEN** it receives the current GameSettings values
- **AND** the component re-renders when settings change

### Requirement: Settings hook for writing (host only)

The system SHALL provide a function for the host to update settings.

#### Scenario: Host can update settings

- **WHEN** the host calls the update function with new settings
- **THEN** the gameSettings map is updated in the Yjs document

#### Scenario: Settings updates are atomic

- **WHEN** the host updates multiple settings at once
- **THEN** all changes are applied in a single Yjs transaction

### Requirement: Implemented rules registry

The system SHALL maintain an `IMPLEMENTED_RULES` set listing house rule keys that have engine-side implementations.

#### Scenario: Registry contains only implemented rules

- **WHEN** `IMPLEMENTED_RULES` is accessed
- **THEN** it SHALL contain only house rule keys with functional engine support
- **AND** it SHALL currently contain `forcePlay`

#### Scenario: Registry is extensible

- **WHEN** a new house rule is implemented in the engine
- **THEN** its key SHALL be added to `IMPLEMENTED_RULES`
- **AND** no component changes are required to enable its toggle
