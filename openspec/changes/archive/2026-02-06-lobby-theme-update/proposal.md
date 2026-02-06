## Why

The lobby/game room page uses a generic dark slate UI while the homepage features an elegant "Card Table" aesthetic with green felt, copper accents, and cream text. This visual inconsistency breaks the immersive casino-like experience we've established. Aligning the lobby to the same design language will create a cohesive user journey from landing to gameplay.

## What Changes

- Remove slate-based color scheme from lobby page, letting the felt background show through
- Restyle player cards with cream backgrounds (like playing cards) instead of slate panels
- Convert all buttons to use `.btn-copper` styling
- Convert inputs and modals to use the established felt/copper design system
- Add a placeholder Game Settings panel visible to all players (host-only configure button)
- Update room code copy hint from "Click to Copy" to "Click to copy room URL"

## Capabilities

### New Capabilities
- `lobby-game-settings`: Placeholder UI for game configuration panel. Shows settings summary to all players, with host-only "Configure" button that displays a "Coming Soon" state.

### Modified Capabilities
- `lobby-management`: Visual presentation changes for player cards, modals, and lobby layout. Adds room URL copy hint clarification.

## Impact

- `app/room/[id]/page.tsx`: Remove slate colors, update text to cream palette, add GameSettingsPanel
- `components/lobby/PlayerList.tsx`: Restyle cards with cream background and dark text
- `components/lobby/JoinGameModal.tsx`: Apply felt panel + copper input/button styles
- `components/lobby/StartGameButton.tsx`: Convert to `.btn-copper`
- `components/lobby/HostDisconnectModal.tsx`: Apply felt panel styling
- `components/lobby/GameSettingsPanel.tsx`: New component (placeholder)
- `app/globals.css`: May add `.panel-felt` and `.card-player` utility classes
