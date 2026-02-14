# Design: game-board-layout-change

## Context

The current game board table center displays draw and discard piles using a fixed card size (`md`: 80x120px) across all viewport sizes. The piles are centered vertically in the available space between opponents and the player's hand.

**Current implementation:**
- `DeckPile.tsx` renders `UnoCard` with `size="md"` (80x120px)
- `DiscardPile.tsx` renders `UnoCard` with `size="md"` (80x120px)
- `TableCenter.tsx` uses flexbox to center both piles horizontally with gap

**Constraint**: The mobile layout (<768px) must remain unchanged.

## Goals / Non-Goals

**Goals:**
- Increase card size by ~60% on desktop breakpoints (≥768px) - 130x195 vs mobile 80x120
- Add 200px bottom padding to table center on desktop for upward shift
- Maintain identical mobile behavior

**Non-Goals:**
- Add new card size variants (already available via UnoCard component)
- Modify player's hand or opponent positioning
- Add animations or transitions for size changes

## Decisions

### D1: Use custom dimensions for ~60% larger card size

**Decision**: Pass custom `cardWidth` and `cardHeight` props to DeckPile/DiscardPile components.

**Rationale**: To achieve ~60% larger cards on desktop (about 20% less than 2x), use 130x195px vs mobile 80x120px. This maintains the 2:3 aspect ratio while being noticeably larger.

**Alternative considered**: Use UnoCard's `lg` size
- Rejected: lg is smaller than md (design issue in UnoCard), and user wants 2x size

### D2: Apply vertical offset via bottom padding

**Decision**: Add `md:pb-[200px]` class to the TableCenter container to push the piles up by adding bottom padding.

**Rationale**: Using bottom padding (instead of negative margin) is more intuitive and maintains proper flow layout. The 200px value provides adequate upward shift on desktop.

**Alternative considered**: Negative margin (`md:-mt-[100px]`)
- Rejected: Bottom padding is cleaner and more predictable for layout flow

### D3: Use custom dimensions via style prop

**Decision**: Pass dimensions via UnoCard's `style` prop to override default sizing.

**Rationale**: Allows flexible custom sizing without modifying UnoCard's sizeMap.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Card size change affects perceived distance between piles | Low - gap is responsive already | Test on actual viewport sizes |
| Bottom padding may increase total table height on desktop | Low - padding is intentional for visual balance | Tailwind's responsive classes ensure it only applies at md+ |
| No smooth transition between sizes | Visual | Not a priority for this change; can add later if needed |

## Migration Plan

1. Modify `DeckPile.tsx` - add `cardWidth`/`cardHeight` props with custom dimensions
2. Modify `DiscardPile.tsx` - add `cardWidth`/`cardHeight` props with custom dimensions
3. Modify `TableCenter.tsx` - pass 130x195 for desktop, 80x120 for mobile; add `md:pb-[200px]`
4. Test on mobile (<768px) - should be unchanged (80x120)
5. Test on desktop (≥768px) - verify larger cards (130x195) and upward shift

**Rollback**: Revert the three component changes to restore original state.
