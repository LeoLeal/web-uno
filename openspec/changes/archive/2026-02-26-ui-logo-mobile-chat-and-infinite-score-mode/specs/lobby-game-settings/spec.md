## MODIFIED Requirements

### Requirement: Game Settings Panel Display

The system SHALL display a Game Settings panel in the lobby that shows current game configuration to all players with dynamic content based on actual settings.

#### Scenario: Settings visible to all players

- **WHEN** any player is in the lobby
- **THEN** they see a Game Settings panel
- **AND** the panel displays a dynamic summary of current settings

#### Scenario: Summary reflects actual settings

- **WHEN** settings are at default values
- **THEN** the summary displays `No stacking · 7 cards · Single Round`

#### Scenario: Summary updates when settings change

- **WHEN** the host changes settings
- **THEN** the summary text updates to reflect the new configuration
- **AND** non-default values are indicated in the summary

### Requirement: Settings modal has Deal section

The GameSettingsModal SHALL have a "Deal" section with starting hand size and score mode options.

#### Scenario: Starting hand size selection

- **WHEN** the host views the Deal section
- **THEN** they see a pill button group with options 5, 7, and 10
- **AND** the current value is highlighted
- **AND** an info tooltip explains the setting

#### Scenario: Score mode selection

- **WHEN** the host views the Deal section
- **THEN** they see score options including `Single Round`, 100, 200, 300, 500, and `∞`
- **AND** `Single Round` maps to `scoreLimit = null`
- **AND** `∞` maps to `scoreLimit = Infinity`
- **AND** numeric values map to finite threshold multi-round mode
- **AND** the current value is highlighted
- **AND** an info tooltip explains the setting
