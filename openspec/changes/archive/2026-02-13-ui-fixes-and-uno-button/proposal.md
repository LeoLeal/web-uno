## Why

The UI has several inconsistencies and usability issues that diminish the user experience. The room URL is accidentally selectable, modal styling is inconsistent (different backgrounds, backdrop opacity, button styles), and the game board needs visual improvements (larger opponent avatars, better card count visualization, and a missing UNO button). These are quick fixes that improve polish and consistency across the application.

## What Changes

- **Room URL element**: Add `select-none` to prevent text selection when clicking to copy
- **Modal button styling**: Update `GameAlreadyStartedModal` and `WinByWalkoverModal` primary buttons to match the `btn-copper` CSS class (gradient, border, pill shape, proper shadows)
- **Modal background**: Use `.panel-felt` CSS class for all modals instead of invalid `bg-(--felt)` to ensure consistent green felt texture
- **Modal backdrop**: Change opacity from 70% to 40% across all modals
- **Modal border-radius**: Standardize to match `.panel-felt` style (1rem rounded)
- **Opponent avatars**: Increase size from 56px (`w-14 h-14`) to larger (responsive: `w-16 md:w-20`)
- **Opponent card count**: Replace inline card backs + "×N" text with a fan of back cards showing ALL cards (no badge)
- **Opponent name display**: Position name in a rounded box with copper border that overlaps the avatar bottom
- **UNO button**: Add circular UNO button above player's hand cards (uses btn-copper styling, visible always, enabled at 2 cards)
- **Player hand positioning**: Use fixed positioning at bottom of viewport for mobile
- **Player hand responsive**: Cards scale to fit within screen width (tighter spacing with more cards)
- **Game board layout**: Use flexbox to vertically center table area while keeping player hand fixed to bottom

## Capabilities

### New Capabilities
- `uno-button`: A clickable circular UNO button positioned above the player's hand that allows calling UNO when down to 1 card

### Modified Capabilities
- `game-board-ui`: Modify existing spec to include larger opponent avatars, card count fan visualization, and UNO button placement
- `ui-modal`: Modify existing spec to define consistent modal styling (panel-felt background, 40% backdrop, standardized border-radius)

## Impact

**Files affected:**
- `app/room/[id]/page.tsx` - Room URL select-none
- `components/modals/GameAlreadyStartedModal.tsx` - Button styling, background, backdrop
- `components/modals/WinByWalkoverModal.tsx` - Button styling, background, backdrop
- `components/modals/WaitingForPlayerModal.tsx` - Background, backdrop
- `components/modals/HostDisconnectModal.tsx` - Background, backdrop
- `components/modals/JoinGameModal.tsx` - Background, backdrop
- `components/modals/GameSettingsModal.tsx` - Background, backdrop
- `components/game/OpponentIndicator.tsx` - Avatar size, card fan
- `components/game/PlayerHand.tsx` - UNO button
- `openspec/specs/game-board-ui/spec.md` - Updated for new visual elements
- `openspec/specs/ui-modal/spec.md` - Updated for consistent styling
