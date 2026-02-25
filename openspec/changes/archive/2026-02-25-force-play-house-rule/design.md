## Context

The game settings system (`lib/game/settings.ts`) defines 6 boolean house rules, fully plumbed through Yjs sync (`useGameSettings`) and the lobby UI (`GameSettingsModal`). However, the game engine (`useGameEngine.ts`) ignores all of them — card playability is checked inline and `DRAW_CARD` has no conditional behavior.

The playability logic is duplicated: once in `useGameEngine.ts` (host authority, lines 344-349) and once in `useGamePlay.ts` (client pre-validation, lines 55-72). Both are identical but neither is extracted.

The `ToggleSwitch` component already supports a `disabled` prop with CSS styling (opacity + cursor).

## Goals / Non-Goals

**Goals:**

- Implement Force Play as the first functional house rule
- Establish a clean "plugin" pattern: house rules must NOT alter core gameplay paths when disabled
- Extract shared `isCardPlayable` utility to eliminate duplication
- Disable unimplemented rule toggles so players aren't misled
- Maintain full backward compatibility (Force Play defaults to `false`)

**Non-Goals:**

- Implementing any other house rules (Draw Stacking, Jump-In, Zero Swap, Seven Swap, Multiple Card Play)
- Creating a formal plugin/middleware system for rules — a simple conditional is sufficient for now
- Adding visual toast/feedback when Force Play blocks a draw attempt (future enhancement)

## Decisions

### 1. Extract `isCardPlayable` to `lib/game/cards.ts`

**Decision**: Create a shared pure function `isCardPlayable(card, topDiscard): boolean` and a companion `hasPlayableCard(hand, topDiscard): boolean`.

**Why**: Eliminates duplication between engine and client. Both `useGameEngine` and `useGamePlay` will call the same function. The Force Play guard in the engine depends on `hasPlayableCard`.

**Alternative considered**: Keep inline and only add `hasPlayableCard`. Rejected because the duplication is a maintenance risk and the playability check is the canonical game rule.

### 2. Host-authoritative enforcement with client UX hint

**Decision**: Two-layer approach:

- **Engine (authority)**: `useGameEngine` reads `forcePlay` from options. In the `DRAW_CARD` handler, before executing the draw, check `hasPlayableCard`. If true, reject the action (set to `null`).
- **Client (UX)**: `useGamePlay` exposes `canDraw: boolean`. When `forcePlay` is on and hand has playable cards, `canDraw` is `false`. Used to disable the draw button.

**Why**: The P2P architecture requires the host to validate all actions — client-side checks alone would be bypassable. The client hint provides instant UX feedback without a round-trip.

### 3. Force Play as a simple conditional, not a plugin system

**Decision**: A single `if (forcePlay)` guard in the `DRAW_CARD` handler. No middleware, no rule registry, no event system.

**Why**: One rule doesn't justify architectural overhead. When more rules arrive, patterns will emerge and we can refactor. YAGNI.

### 4. `IMPLEMENTED_RULES` set in `settings.ts`

**Decision**: A `ReadonlySet<BooleanSettingKey>` listing rules with engine support. `GameSettingsModal` uses it to set `disabled` on toggles for unimplemented rules.

**Why**: Single source of truth. When a new rule is implemented, add its key to the set and the toggle auto-enables. No component changes required.

**Alternative considered**: A `disabled` prop per-toggle hardcoded in the modal. Rejected because it's fragile and scatters knowledge.

### 5. Pass `forcePlay` through `UseGameEngineOptions`

**Decision**: Add `forcePlay?: boolean` to the existing options interface. Wire it from `settings.forcePlay` in `page.tsx`.

**Why**: Follows the existing pattern for `startingHandSize` and `scoreLimit`. The engine already receives settings this way. Adding `forcePlay` to the effect's dependency array ensures the observer re-attaches when the setting changes.

## Risks / Trade-offs

- **Stale `forcePlay` during a game**: If the setting changes mid-game (it shouldn't — settings are locked during gameplay), the engine observer re-attaches. Low risk given existing lock mechanism.
- **No user feedback on rejected draw**: When Force Play rejects a draw, the action silently fails (same as other invalid actions). The `canDraw` flag prevents this from happening in practice. Acceptable for now.
- **`useGamePlay` signature change**: Adding optional `options` parameter is backward-compatible, but all call sites that need `canDraw` must pass `forcePlay` + `hand`. Only `page.tsx` currently uses the hook.
