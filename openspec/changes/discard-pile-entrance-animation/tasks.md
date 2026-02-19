## 1. CSS Keyframes

- [ ] 1.1 Create `DiscardPile.module.css` with `enterFromTop` keyframe (opacity 0→1 at 50%, translateY -30vh, rotation via CSS var)
- [ ] 1.2 Add `enterFromBottom` keyframe (opacity always 1, translateY 40vh, rotation via CSS var)
- [ ] 1.3 Define CSS variables: `--entrance-rotation-start`, `--final-rotation`, `--final-offset-x`, `--final-offset-y`

## 2. DiscardPile Component Updates

- [ ] 2.1 Add `lastPlayedBy` and `myClientId` props to `DiscardPile` component interface
- [ ] 2.2 Replace inline `slice(-3)` with a named `VISIBLE_DISCARD_COUNT` constant (default `3`) and derive `visibleCards` from it
- [ ] 2.3 Add effect-based top-card transition detection with mount guard (`topCardId`, `previousTopCardIdRef`, `hasMountedRef`, `animatedTopCardId`)
- [ ] 2.4 Add `entranceRotations` cache (similar to `transformsById`) for random entrance rotation values (-420° to 420°)
- [ ] 2.5 Determine animation class based on `lastPlayedBy === myClientId` (bottom vs top)
- [ ] 2.6 Apply animation class and CSS variables to the top card wrapper element only when `card.id === animatedTopCardId && lastPlayedBy !== null`

## 3. Parent Component Integration

- [ ] 3.1 Update `TableCenter.tsx` to consume `lastPlayedBy` from `useGameState`
- [ ] 3.2 Pass `lastPlayedBy` and `myClientId` props to `DiscardPile` component

## 4. Testing

- [ ] 4.1 Add unit test: top card receives animation class when new card is played by current player
- [ ] 4.2 Add unit test: top card receives animation class when new card is played by opponent
- [ ] 4.3 Add unit test: no animation class when `lastPlayedBy` is null
- [ ] 4.4 Add unit test: previous cards in pile do not receive animation class
- [ ] 4.5 Add unit test: no animation on initial mount with non-empty discard pile
- [ ] 4.6 Add unit test: no animation when `DRAW_CARD` re-renders game state but discard top-card ID is unchanged
- [ ] 4.7 Add unit test: entrance rotation is generated within -420° to 420° range
- [ ] 4.8 Add unit test: `visibleCards` honors `VISIBLE_DISCARD_COUNT` (default 3) and remains bounded as pile grows
