## Context

The `DiscardPile` component currently displays up to 3 cards with random rotation and offset transforms for an organic pile appearance. When a new card is played, it appears instantly with no entrance animation.

**Current state:**
- `DiscardPile` receives `cards` array and applies random transforms via `transformsById` memo
- `useGameState` now tracks `lastPlayedBy` (clientId of the player who just played)
- Transform values are cached per-card to prevent jitter on re-renders

**Stakeholders:**
- `DiscardPile.tsx` - needs animation logic
- `TableCenter.tsx` - needs to pass `lastPlayedBy` prop
- `useGameState.ts` - already provides `lastPlayedBy`

## Goals / Non-Goals

**Goals:**
- Animate newly played cards with entrance from provenance-based origin
- Use CSS-only animations (no JS animation libraries)
- Apply animation only to the top (most recent) card
- Maintain stable transforms for cards already in the pile

**Non-Goals:**
- Animate cards other than the top card
- Add sound effects for card plays (out of scope)
- Animate on initial game load (only on new plays during gameplay)
- Support custom animation duration/timing (use fixed values)

### 0. Visible discard subset as a tunable constant

**Decision:** Keep rendering a bounded visible discard subset, but replace inline magic number usage with a named constant (default `3`).

**Rationale:**
- Preserves current UX/performance expectations (organic pile with small visible history).
- Keeps DOM/render work bounded regardless of game length.
- Makes future tuning a one-line change instead of a behavior hunt.

**Implementation:**
```tsx
const VISIBLE_DISCARD_COUNT = 3;
const visibleCards = cards.slice(-VISIBLE_DISCARD_COUNT);
```

**Alternatives considered:**
- Render full discard pile: rejected for unbounded render cost and visual clutter.
- Keep hardcoded `slice(-3)`: rejected due to maintainability and configurability concerns.

## Decisions

### 1. Detecting "new" top card without ref reads during render

**Decision:** Derive `topCardId` from visible cards, then detect top-card transitions inside `useEffect`. Use local state (`animatedTopCardId`) to drive class application.

**Rationale:**
- Avoids reading mutable refs during render (which can trigger TypeScript/lint warnings).
- Encodes the required behavior: animate only when top-card ID changes after mount.
- Prevents false positives on re-renders where discard pile did not change (for example `DRAW_CARD`).

**Implementation:**
```tsx
const topCardId = visibleCards[visibleCards.length - 1]?.id ?? null;
const [animatedTopCardId, setAnimatedTopCardId] = useState<string | null>(null);
const previousTopCardIdRef = useRef<string | null>(null);
const hasMountedRef = useRef(false);

useEffect(() => {
  if (!hasMountedRef.current) {
    hasMountedRef.current = true;
    previousTopCardIdRef.current = topCardId;
    return;
  }

  if (topCardId !== previousTopCardIdRef.current) {
    setAnimatedTopCardId(topCardId);
  } else {
    setAnimatedTopCardId(null);
  }

  previousTopCardIdRef.current = topCardId;
}, [topCardId]);
```

**Alternatives considered:**
- Compare `cards.length` - misses replacement cases and is less explicit than top-card identity.
- Use a `key` change to force remount - breaks transform caching and can cause visual jitter.

### 2. Provenance-based animation direction

**Decision:** Compare `lastPlayedBy` to `myClientId` to determine if card came from current player (bottom) or opponent (top).

**Rationale:** `lastPlayedBy` tracks who just played. If it's me, animate from bottom. If it's someone else, animate from top.

**Implementation:**
```tsx
const animationOrigin = lastPlayedBy === myClientId ? 'bottom' : 'top';
```

**Edge case:** If `lastPlayedBy` is `null` (game start, no plays yet), skip animation.

### 3. CSS animation approach

**Decision:** Use CSS keyframes with CSS custom properties (variables) for dynamic values.

**Rationale:** CSS variables allow us to pass JS-generated random values and final transform values into the animation without generating unique keyframe strings.

**Implementation:**
```css
@keyframes enterFromTop {
  0% {
    opacity: 0;
    transform: 
      translateY(-30vh) 
      rotate(var(--entrance-rotation-start));
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: 
      translate(var(--final-offset-x), var(--final-offset-y)) 
      rotate(var(--final-rotation));
  }
}

@keyframes enterFromBottom {
  from {
    opacity: 1;
    transform: 
      translateY(40vh) 
      rotate(var(--entrance-rotation-start));
  }
  to {
    opacity: 1;
    transform: 
      translate(var(--final-offset-x), var(--final-offset-y)) 
      rotate(var(--final-rotation));
  }
}
```

**Timing:** `600ms ease-out` (prone to adjustment for stronger ease-out curve)

### 4. Where to apply animation

**Decision:** Apply animation class to the wrapper `<div>` of the top card only.

**Rationale:** Only the top card animates. The wrapper already has `absolute inset-0` positioning, making it ideal for the transform animation.

**Implementation:**
```tsx
<div
  key={card.id}
  className={cn(
    'absolute inset-0',
    card.id === animatedTopCardId && lastPlayedBy !== null && animationClass
  )}
  style={{
    '--entrance-rotation-start': `${entranceRotation}deg`,
    '--final-rotation': `${transform.rotation}deg`,
    '--final-offset-x': `${transform.offsetX}px`,
    '--final-offset-y': `${transform.offsetY}px`,
  }}
>
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Animation plays on every re-render | Trigger only from `topCardId` transition effect; clear `animatedTopCardId` when unchanged |
| `lastPlayedBy` is null on game start | Skip animation when `lastPlayedBy === null` |
| `DRAW_CARD` causes unrelated re-render | `DRAW_CARD` does not modify `discardPile`, so `topCardId` stays same and animation does not trigger |
| Animation jank on slow devices | CSS transform animations are GPU-accelerated; `ease-out` timing is performant |
| Rotation range (-420 to 420) | This is intentional for visual flair; can adjust if feedback is negative |
| Multiple cards played rapidly | Each card gets its own animation; animations may overlap (acceptable) |

## Open Questions

- None currently. Implementation approach is straightforward.
