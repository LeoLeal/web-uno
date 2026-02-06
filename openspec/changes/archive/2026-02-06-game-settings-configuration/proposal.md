## Why

The Game Settings panel currently displays a hardcoded placeholder ("Standard rules · 7 cards · No stacking") with a "Coming Soon" toast when the host clicks Configure. Players need the ability to customize game rules before starting a match, enabling house rules and varied gameplay experiences.

## What Changes

- Replace the placeholder "Coming Soon" behavior with a functional settings configuration modal
- Add configurable game options: starting hand size, score limit, and 6 house rule toggles
- Sync settings via Yjs so all players see the current configuration in real-time
- Create reusable UI components: Modal (native `<dialog>`), ToggleSwitch, PillButtonGroup, InfoTooltip
- Migrate existing modals (JoinGameModal, HostDisconnectModal) to use the shared Modal component

## Capabilities

### New Capabilities

- `ui-modal`: Shared modal component using native `<dialog>` element with accessibility features (focus trap, escape to close, backdrop click)
- `ui-toggle-switch`: Boolean toggle switch component with copper/felt theme styling
- `ui-pill-button-group`: Discrete option selector with pill-shaped buttons for selecting from predefined values
- `ui-info-tooltip`: Info icon with tooltip using CSS anchor positioning (hover on desktop, tap on mobile)
- `game-settings`: Game settings types, defaults, and Yjs synchronization logic

### Modified Capabilities

- `lobby-game-settings`: Replace placeholder behavior with functional configuration modal, dynamic settings display

## Impact

- **Components**: New UI components in `components/ui/`, new `GameSettingsModal` in `components/lobby/`
- **Existing modals**: `JoinGameModal` and `HostDisconnectModal` refactored to use shared Modal
- **State**: Game settings added to Yjs document for P2P sync
- **Styles**: New CSS in `globals.css` for modal, toggle, pill group, and tooltip components
- **Types**: New `GameSettings` interface in `lib/game/settings.ts`
