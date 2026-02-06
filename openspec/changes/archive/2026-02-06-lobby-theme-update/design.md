## Context

The homepage implements a "Card Table" design aesthetic using CSS custom properties in `globals.css`:
- Green felt background with noise texture and vignette
- Copper/bronze interactive elements (`.btn-copper`, `.input-copper`)
- Cream text colors (`--cream`, `--cream-dark`)
- Card styling (`--card-white`, `--shadow-card`)

The lobby page (`app/room/[id]/page.tsx`) and its components currently use a generic slate-based dark theme that doesn't match this established design language.

## Goals / Non-Goals

**Goals:**
- Achieve visual consistency between homepage and lobby
- Leverage existing CSS custom properties and utility classes
- Establish player cards as "playing card" metaphor (cream on felt)
- Add placeholder game settings UI that fits the theme
- Keep the implementation straightforward and maintainable

**Non-Goals:**
- Implementing actual game settings functionality (placeholder only)
- Redesigning the game board (future work)
- Adding new animations beyond what exists
- Refactoring component structure

## Decisions

### Decision 1: Player Cards Use Cream Background

Player cards will use `--card-white` (#fff8f0) background with dark text, resembling physical playing cards resting on the felt table. This creates clear visual hierarchy:
- Felt = environment/surface
- Cream cards = players (and later, game cards)
- Copper = interactive controls

**Text on cards**: Use `--wood-dark` (#5c4033) or similar dark brown for readable contrast against cream.

**"You" indicator**: Replace blue border with copper glow/border to stay within palette.

**Host crown**: Keep yellow/gold - it complements the copper palette.

### Decision 2: Reuse Existing CSS Utilities

Leverage existing classes from `globals.css`:
- `.btn-copper` for all primary buttons (Start Game, Join Lobby)
- `.input-copper` for text inputs (player name)

Add minimal new utilities as needed:
- `.panel-felt` for modal/panel backgrounds (dark felt with copper border)
- `.card-player` for player card styling (optional, can inline)

### Decision 3: Game Settings Panel as Visible Summary

The settings panel will be visible to all players showing current settings as read-only summary text (e.g., "Standard rules - 7 cards - No stacking"). Only the host sees the "Configure" button, which shows a "Coming Soon" state when clicked (toast or disabled modal).

This keeps all players informed while establishing the UI pattern for future functionality.

### Decision 4: Minimal Structural Changes

Keep the existing component structure. Changes are primarily:
- Swapping color classes (slate-* to CSS variables)
- Adding one new component (`GameSettingsPanel`)
- Updating class names, not restructuring JSX

## Risks / Trade-offs

**[Risk] Dark text on cream may need tuning for accessibility**
- Mitigation: Use sufficient contrast ratio (4.5:1 minimum). `--wood-dark` on `--card-white` should be adequate.

**[Risk] Adding utilities to globals.css increases CSS surface area**
- Mitigation: Only add if truly reused. Player card styling can be inline if unique to lobby.

**[Trade-off] Placeholder settings adds UI without functionality**
- Accepted: Establishes UX pattern, communicates feature intent, low implementation cost.
