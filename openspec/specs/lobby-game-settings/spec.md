# Spec: Lobby Game Settings

## Purpose
Provides a game settings panel in the lobby that displays current game configuration to all players, with host-only configuration controls.

## Requirements

### Requirement: Game Settings Panel Display
The system SHALL display a Game Settings panel in the lobby that shows current game configuration to all players.

#### Scenario: Settings visible to all players
- **WHEN** any player is in the lobby
- **THEN** they see a Game Settings panel
- **AND** the panel displays a summary of current settings (e.g., "Standard rules - 7 cards - No stacking")

### Requirement: Host-Only Configure Button
The system SHALL display a "Configure" button on the Game Settings panel only to the host player.

#### Scenario: Host views settings panel
- **WHEN** the host player views the Game Settings panel
- **THEN** they see a "Configure" button

#### Scenario: Non-host views settings panel
- **WHEN** a non-host player views the Game Settings panel
- **THEN** they do NOT see a "Configure" button
- **AND** they see the settings as read-only

### Requirement: Placeholder Configuration State
The system SHALL display a "Coming Soon" state when the host attempts to configure game settings.

#### Scenario: Host clicks configure
- **WHEN** the host clicks the "Configure" button
- **THEN** the system indicates the feature is not yet available (e.g., toast notification or disabled modal)
- **AND** no settings are modified
