## Why

The game settings UI defines 6 house rules (Draw Stacking, Jump-In, Zero Swap, Seven Swap, Force Play, Multiple Card Play) with toggle switches, but none are implemented in the game engine — they're purely decorative. This change implements **Force Play** as the first functional house rule, establishing the pattern for future rule plugins. It also disables unimplemented rule toggles so players aren't misled.

## What Changes

- Extract duplicated card-playability logic into a shared pure function in `lib/game/cards.ts`
- Add Force Play enforcement to the host game engine: reject `DRAW_CARD` actions when the player has a playable card
- Add client-side `canDraw` flag to `useGamePlay` for UX feedback (disable draw button)
- Pass `forcePlay` setting from Yjs through to the game engine
- Disable toggle switches for unimplemented house rules in `GameSettingsModal` (visible but not interactive)
- Add `IMPLEMENTED_RULES` registry in `settings.ts` for tracking which rules have engine support

## Capabilities

### New Capabilities

_None — Force Play is an enhancement to existing capabilities._

### Modified Capabilities

- `gameplay-actions`: Add Force Play guard to `DRAW_CARD` validation — when enabled, host rejects draws if player has a playable card
- `gameplay-card-play`: Extract `isCardPlayable` shared utility used by both host validation and client pre-validation
- `lobby-game-settings`: Disable toggle switches for house rules not yet implemented in the engine
- `game-settings`: Add `IMPLEMENTED_RULES` registry and `hasPlayableCard` utility

## Impact

- **Hooks**: `useGameEngine.ts` (new `forcePlay` option + draw guard), `useGamePlay.ts` (refactor to shared util + `canDraw`)
- **Components**: `GameSettingsModal.tsx` (disabled toggles for unimplemented rules)
- **Lib**: `lib/game/cards.ts` (new exports), `lib/game/settings.ts` (new export)
- **Page**: `app/room/page.tsx` (wire settings through to hooks)
- **Tests**: Updates needed for `cards.test.ts`, `useGamePlay.test.ts`, `GameSettingsModal.test.tsx`
- **No breaking changes**: Force Play defaults to `false`, existing behavior unchanged
