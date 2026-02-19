## 1. Game State Changes

- [x] 1.1 Add `lastPlayedBy` state in `useGameState.ts` (observe from Yjs, expose as `number | null`)
- [x] 1.2 Set `lastPlayedBy` in `useGameEngine.ts` when host processes valid `PLAY_CARD` action

## 2. CSS Keyframes

- [x] 2.1 Create `DiscardPile.module.css` with `enterFromTop` keyframe (opacity 0→1 at 50%, translateY -30vh, rotation via CSS var)
- [x] 2.2 Add `enterFromBottom` keyframe (opacity always 1, translateY 40vh, rotation via CSS var)
- [x] 2.3 Define CSS variables: `--entrance-rotation-start`, `--final-rotation`, `--final-offset-x`, `--final-offset-y`

## 3. DiscardPile Component Updates

- [x] 3.1 Add `lastPlayedBy` and `myClientId` props to `DiscardPile` component interface
- [x] 3.2 Replace inline `slice(-3)` with a named `VISIBLE_DISCARD_COUNT` constant (default `3`) and derive `visibleCards` from it
- [x] 3.3 Add effect-based top-card transition detection with mount guard (`topCardId`, `previousTopCardIdRef`, `hasMountedRef`, `animatedTopCardId`)
- [x] 3.4 Add `entranceRotations` cache (similar to `transformsById`) for random entrance rotation values (-420° to 420°)
- [x] 3.5 Determine animation class based on `lastPlayedBy === myClientId` (bottom vs top)
- [x] 3.6 Apply animation class and CSS variables to the top card wrapper element only when `card.id === animatedTopCardId && lastPlayedBy !== null`

## 4. Parent Component Integration

- [x] 4.1 Update `GameBoard.tsx` to accept and forward `lastPlayedBy` prop
- [x] 4.2 Update `TableCenter.tsx` to consume `lastPlayedBy` and `myClientId` from props
- [x] 4.3 Pass `lastPlayedBy` and `myClientId` props through component hierarchy to `DiscardPile`
- [x] 4.4 Update `app/room/page.tsx` to read `lastPlayedBy` from `useGameState` and pass to `GameBoard`

## 5. Testing

- [x] 5.1 Add unit test: top card receives animation class when new card is played by current player
- [x] 5.2 Add unit test: top card receives animation class when new card is played by opponent
- [x] 5.3 Add unit test: no animation class when `lastPlayedBy` is null
- [x] 5.4 Add unit test: previous cards in pile do not receive animation class
- [x] 5.5 Add unit test: no animation on initial mount with non-empty discard pile
- [x] 5.6 Add unit test: no animation when `DRAW_CARD` re-renders game state but discard top-card ID is unchanged
- [x] 5.7 Add unit test: entrance rotation is generated within -420° to 420° range
- [x] 5.8 Add unit test: `visibleCards` honors `VISIBLE_DISCARD_COUNT` (default 3) and remains bounded as pile grows
