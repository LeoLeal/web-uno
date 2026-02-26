## MODIFIED Requirements

### Requirement: Game settings type definition

The system SHALL define a GameSettings interface with all configurable options.

#### Scenario: Settings interface includes all options

- **WHEN** the GameSettings type is used
- **THEN** it includes `startingHandSize` with values 5, 7, or 10
- **AND** it includes `scoreLimit` with values 100, 200, 300, 500, positive infinity, or null
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

#### Scenario: Score mode description clarity

- **WHEN** tooltip content is shown for score limit settings
- **THEN** the description explicitly distinguishes `Single Round` from `Infinite`
- **AND** the description explains that `Infinite` keeps cumulative scoring without automatic match end
