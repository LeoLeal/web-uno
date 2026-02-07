## Why

The current Game Settings label for stacking rules is implicit or unclear when stacking is disabled. Explicitly stating "No stacking" improves clarity for players configuring the game.

## What Changes

- Update the label description in the Game Settings UI to explicitly say "No stacking" when the rule is disabled (false).

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `game-settings-configuration`: Update requirement for rule description clarity.

## Impact

- `components/lobby/GameSettingsPanel.tsx`: Update rendering logic for the toggle label.
