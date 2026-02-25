# Spec: Lobby Game Settings

## Purpose

Provides a game settings panel in the lobby that displays current game configuration to all players, with host-only configuration controls.

## Requirements

### Requirement: Game Settings Panel Display

The system SHALL display a Game Settings panel in the lobby that shows current game configuration to all players with dynamic content based on actual settings.

#### Scenario: Settings visible to all players

- **WHEN** any player is in the lobby
- **THEN** they see a Game Settings panel
- **AND** the panel displays a dynamic summary of current settings

#### Scenario: Summary reflects actual settings

- **WHEN** settings are at default values
- **THEN** the summary displays "No stacking · 7 cards" (replacing "Standard rules")

#### Scenario: Summary updates when settings change

- **WHEN** the host changes settings
- **THEN** the summary text updates to reflect the new configuration
- **AND** non-default values are indicated in the summary

### Requirement: Host-Only Configure Button

The system SHALL display a "Configure" button on the Game Settings panel only to the host player.

#### Scenario: Host views settings panel

- **WHEN** the host player views the Game Settings panel
- **THEN** they see a "Configure" button

#### Scenario: Non-host views settings panel

- **WHEN** a non-host player views the Game Settings panel
- **THEN** they do NOT see a "Configure" button
- **AND** they see the settings as read-only

### Requirement: Settings modal opens on configure

The system SHALL open a settings configuration modal when the host clicks the Configure button.

#### Scenario: Configure button opens modal

- **WHEN** the host clicks the "Configure" button
- **THEN** the GameSettingsModal opens
- **AND** the modal displays current settings values

### Requirement: Settings modal has Deal section

The GameSettingsModal SHALL have a "Deal" section with starting hand size and score limit options.

#### Scenario: Starting hand size selection

- **WHEN** the host views the Deal section
- **THEN** they see a pill button group with options 5, 7, and 10
- **AND** the current value is highlighted
- **AND** an info tooltip explains the setting

#### Scenario: Score limit selection

- **WHEN** the host views the Deal section
- **THEN** they see a pill button group with options 100, 200, 300, 500, and ∞
- **AND** the current value is highlighted
- **AND** an info tooltip explains the setting

### Requirement: Settings modal has House Rules section

The GameSettingsModal SHALL have a "House Rules" section with toggle switches for each rule modifier, with unimplemented rules disabled.

#### Scenario: Toggle switches for each rule

- **WHEN** the host views the House Rules section
- **THEN** they see toggle switches for: Draw Stacking, Jump-In, Zero Swap, Seven Swap, Force Play, Multiple Card Play
- **AND** each toggle shows current on/off state
- **AND** each toggle has an info tooltip explaining the rule
- **AND** the Draw Stacking toggle description explicitly says "No stacking" when disabled (OFF)

#### Scenario: Unimplemented rules are disabled

- **WHEN** the host views the House Rules section
- **AND** a house rule is NOT in `IMPLEMENTED_RULES`
- **THEN** that rule's toggle switch SHALL be disabled (not interactive)
- **AND** the toggle SHALL display "Coming soon" label text
- **AND** the toggle SHALL be visually dimmed (via existing disabled CSS)

#### Scenario: Implemented rules are enabled

- **WHEN** the host views the House Rules section
- **AND** a house rule IS in `IMPLEMENTED_RULES`
- **THEN** that rule's toggle switch SHALL be fully interactive
- **AND** no "Coming soon" label is shown

### Requirement: Settings modal has draft state

The GameSettingsModal SHALL maintain draft state for settings changes until explicitly saved.

#### Scenario: Changes are not applied immediately

- **WHEN** the host changes a setting in the modal
- **THEN** the change is reflected in the modal UI
- **AND** the change is NOT applied to the game until Save is clicked

### Requirement: Settings modal can save changes

The GameSettingsModal SHALL have a Save button that commits changes to the game settings.

#### Scenario: Save applies settings

- **WHEN** the host clicks the "Save Settings" button
- **THEN** all draft changes are committed to the Yjs document
- **AND** the modal closes
- **AND** the settings panel summary updates to reflect new settings

### Requirement: Settings modal can reset to defaults

The GameSettingsModal SHALL have a Reset button that reverts draft settings to defaults.

#### Scenario: Reset reverts to defaults

- **WHEN** the host clicks the "Reset to Defaults" button
- **THEN** all settings in the modal are reset to DEFAULT_SETTINGS
- **AND** the modal remains open for further editing

### Requirement: Settings modal can be dismissed

The GameSettingsModal SHALL allow the host to close without saving changes.

#### Scenario: Close discards changes

- **WHEN** the host closes the modal (via X button, backdrop click, or Escape key)
- **THEN** the modal closes
- **AND** any unsaved draft changes are discarded
- **AND** the game settings remain unchanged

### Requirement: Settings locked during game

The system SHALL prevent settings changes once the game has started.

#### Scenario: Configure disabled during gameplay

- **WHEN** the game status is PLAYING or ENDED
- **THEN** the Configure button is not displayed
- **AND** settings are read-only for all players
