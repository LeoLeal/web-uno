## Context

This change addresses several UI polish items across the application:

1. **Room URL** - Currently uses `select-all` class which causes accidental text selection
2. **Modal inconsistencies** - Varying backgrounds, backdrop opacity (70% vs 40%), button styles
3. **Game board** - Small opponent avatars (56px), basic card count display, missing UNO button

The design must maintain the existing Uno-themed aesthetic (felt greens, copper accents) while improving visual consistency.

## Goals / Non-Goals

**Goals:**
- Make room URL non-selectable for cleaner UX
- Standardize all modals with consistent `.panel-felt` background and 40% backdrop
- Match modal primary buttons to `btn-copper` style
- Increase opponent avatar visibility
- Replace text-based card counts with visual card fans
- Add functional UNO button

**Non-Goals:**
- No changes to game logic or state management
- No backend or P2P networking changes
- Not adding sound effects or animations (keep it simple)
- Not implementing "challenge" or penalty mechanics for late UNO calls

## Decisions

### 1. Room URL Selection
**Decision:** Use Tailwind's `select-none` instead of `select-all`
- Rationale: The current click-to-copy behavior intentionally selects all text for easy copying. However, users reported accidental selection. Better UX is to use `select-none` and rely on the click action only.

### 2. Modal Background Strategy
**Decision:** Apply `.panel-felt` CSS class to modal container instead of inline styles
- Rationale: The existing `.panel-felt` class (defined in globals.css) provides:
  - `background-color: rgba(13, 40, 24, 0.95)` - consistent felt green
  - `border: 2px solid var(--copper-border)` - copper border
  - `border-radius: 1rem` - standardized rounded corners
  - `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)` - proper depth
- This ensures all modals have identical backgrounds without duplication

### 3. Backdrop Opacity
**Decision:** Standardize all modals to `bg-black/40` (40% opacity)
- Rationale: Current 70% is too dark, 40% allows better context of underlying game state while still focusing attention on modal

### 4. Modal Button Styling
**Decision:** Replace inline button classes with `btn-copper` class
- Rationale: The `btn-copper` class provides:
  - Gradient background (copper-light to copper-dark)
  - 2px copper border
  - Pill shape (border-radius: 9999px)
  - Hover/active states with transform and shadow
- This matches the "Create New Game" button on homepage

### 5. Opponent Avatar Size
**Decision:** Increase from `w-14 h-14` (56px) to `w-20 h-20` (80px)
- Rationale: 56px is too small for mobile visibility. 80px provides better presence while still fitting multiple opponents in the row.
- Alternative considered: 64px (w-16) - still too small

### 6. Card Count Fan
**Decision:** Create a CardCountFan component for opponent card counts that shows ALL cards in a tight fan
- Rationale: Reuse UnoCard component with "back" symbol, apply rotation transforms similar to PlayerHand
- Shows ALL cards (no badge/cap) in a very tight fan with:
  - Card size: 16×24px
  - Rotation: Same arc logic as PlayerHand (up to 90° max)
  - Parabolic vertical offset: Center cards slightly higher (reduced from 20 to 6)
  - Transform origin: center bottom for proper fan pivot
  - Negative margin: -10px between cards for tight spacing

### 7. UNO Button
**Decision:** Add circular UNO button using btn-copper styling
- Position: Fixed at top of PlayerHand container (above "Your Turn!" label)
- Size: 80px diameter (w-20 h-20)
- Style: Uses btn-copper class for consistent theme (gradient, border, shadows)
- Behavior: Visible always, enabled at 2 cards, disabled otherwise

### 8. Player Hand Positioning
**Decision:** Use fixed positioning for player hand on mobile
- Rationale: Flexbox alone wasn't keeping hand at viewport bottom on mobile
- Solution: PlayerHand uses `fixed bottom-0` to anchor to viewport bottom
- Responsive spacing: Cards calculate overlap based on viewport width to fit within screen

### 9. Opponent Name Display
**Decision:** Position name in rounded box overlapping avatar
- Box styling: px-2 py-0.5, rounded-lg, copper border, felt-dark background
- Position: Uses negative margin (-mt-5) to overlap with avatar bottom
- Z-index: z-20 to render above avatar

## Risks / Trade-offs

- [Risk] UNO button needs game logic - May need to stub `callUno` function if not implemented → **Mitigation**: Check existing hooks for UNO call functionality; if missing, create stub in game state
- [Risk] Larger avatars may break mobile layout with 4+ players → **Mitigation**: Use responsive classes (w-16 md:w-20) to scale down on mobile
- [Risk] Card fan for opponents may look cluttered with many cards → **Mitigation**: Cap displayed cards at 5-7, show count badge for larger hands

## Open Questions

1. **UNO call logic**: Does the game engine already support calling UNO? What happens when a player calls UNO?
2. **Late UNO penalty**: Should there be a penalty for forgetting to call UNO? (out of scope for this change, but worth noting)
3. **Mobile layout**: Will the new avatar size + card fan fit on small screens with 4 players?

---

**Next steps:** Move to specs to detail the component-level requirements, then tasks for implementation.
