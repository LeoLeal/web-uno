## 1. Card Type and Data Model Updates

- [x] 1.1 Update `Card` interface: change `color` from `color: CardColorWithWild` to `color?: CardColor`. Remove `CardColorWithWild` type from `cards.ts`
- [x] 1.2 Update `createDeck()` in `deck.ts`: wild cards created without `color` property instead of `color: 'wild'`
- [x] 1.3 Define `PlayerAction` discriminated union type (`PLAY_CARD` with `cardId` and optional `chosenColor`, `DRAW_CARD`)
- [x] 1.4 Fix all TypeScript errors caused by the `Card.color` change across the codebase (components, hooks, tests)
- [x] 1.5 Update existing tests for card creation and deck to reflect optional color on wild cards
- [x] 1.6 Write tests for `PlayerAction` type validation helpers (if any utility functions are added)

## 2. Game State Extensions

- [x] 2.1 Add `actionsMap` Yjs map: register in `useGameEngine` for host observation, provide write access for peers
- [x] 2.2 Implement first discard card effects in `initializeGame()`: Skip (skip first player), Reverse (direction = -1, start with last player), Draw Two (first player draws 2, skipped), Wild (leave colorless), Wild Draw Four (reshuffle — already implemented)
- [x] 2.3 Write tests for first discard card effects (Skip, Reverse, Draw Two, Wild first card, Wild Draw Four reshuffle)

## 3. Action Queue and Host Processing

- [x] 3.1 Create `useGamePlay` hook: `submitAction()`, `canPlayCard()`, `isMyTurn`, `activeColor` (derived from `topDiscard.color`), `topDiscard`
- [x] 3.2 Implement `canPlayCard(card)` local pre-validation: wild always playable, color match, symbol match
- [x] 3.3 Implement host action observer in `useGameEngine`: observe `actionsMap`, detect new non-null entries
- [x] 3.4 Implement host action validation: turn check, card ownership check, playability check, wild color check
- [x] 3.5 Implement host `PLAY_CARD` execution: remove from hand, add to discard (with chosen color mutated onto wild cards), update card counts, apply effects, advance turn — all in one `doc.transact()`
- [x] 3.6 Implement host `DRAW_CARD` execution: pop from deck, add to player hand, update card counts, advance turn
- [x] 3.7 Implement deck reshuffle: when deck empty, take all discard except top, shuffle, use as new deck. For forced draws (Draw Two, Wild Draw Four), deal as many cards as available if deck is insufficient even after reshuffle.
- [x] 3.8 Write tests for `canPlayCard()` (color match, symbol match, wild, no match, null top discard color — any card playable)
- [x] 3.9 Write tests for host action validation (wrong turn, missing card, unplayable card, wild without color)
- [x] 3.10 Write tests for host action execution (card play updates state, draw updates state, deck reshuffle)

## 4. Turn Progression and Action Card Effects

- [x] 4.1 Implement turn advancement: compute next player from `turnOrder`, `currentIndex`, `direction`
- [x] 4.2 Implement Skip effect: skip next player (advance 2 positions in current direction)
- [x] 4.3 Implement Reverse effect: flip direction, advance 1 in new direction
- [x] 4.4 Implement two-player special case: Reverse acts as Skip
- [x] 4.5 Implement Draw Two effect: deal 2 cards to next player, skip their turn
- [x] 4.6 Implement Wild Draw Four effect: deal 4 cards to next player, skip their turn
- [x] 4.7 Write tests for turn advancement (clockwise, counter-clockwise, wraparound)
- [x] 4.8 Write tests for Skip (normal, two-player)
- [x] 4.9 Write tests for Reverse (normal, two-player, direction flip)
- [x] 4.10 Write tests for Draw Two (cards dealt, turn skipped, card counts updated)
- [x] 4.11 Write tests for Wild Draw Four (cards dealt, turn skipped, chosen color on discard card)

## 5. Win Condition

- [x] 5.1 Implement win detection in host action execution: after card play, check if player's hand is empty
- [x] 5.2 Implement game end transition: set `status` to `ENDED`, set `winner`, stop processing actions
- [x] 5.3 Ensure action card effects are applied before win (Draw Two/Wild Draw Four still force draws even on last card)
- [x] 5.4 Write tests for win by normal card, win by action card (Skip, Reverse, Draw Two), win by wild card
- [x] 5.5 Write test that no actions are processed after game end

## 6. Inlined SVG Wild Card Rendering

- [x] 6.1 Create `WildCard.module.css` with CSS classes for wild card quadrant colors: `.quad-red`, `.quad-blue`, `.quad-yellow`, `.quad-green` fills and `.chosen-{color}` overrides (grayscale non-chosen quadrants)
- [x] 6.2 Create `WildCardSvg` component: inline wild and wild-draw4 SVG paths with `className="quad-{color}"` on color paths, accepts `symbol`, `color`, `size`, `className` props, applies `chosen-{color}` class when color is defined
- [x] 6.3 Ensure `WildCardSvg` handles both `wild` and `wild-draw4` symbols with appropriate path data
- [x] 6.4 Test `WildCardSvg` rendering: no color = all colors visible, with color = chosen class applied
- [x] 6.5 Update `UnoCard` component: render wild cards via `WildCardSvg` component instead of `<Image>`, non-wild cards continue using `<Image>`
- [x] 6.6 Write tests for `WildCardSvg` rendering (no color = all colors visible, with color = chosen class applied)
- [x] 6.7 Update `DiscardPile` to render wild cards with `WildCardSvg` when the top card is a wild with assigned color

## 7. Wild Color Picker Modal

- [x] 7.1 Create `WildColorModal` component: modal with 4 color buttons (red, blue, green, yellow), dismiss to cancel
- [x] 7.2 Style color buttons: each button filled with its respective color, clear visual affordance
- [x] 7.3 Wire modal into `GameBoard`: clicking a wild card opens modal, selecting color triggers `submitAction` with `chosenColor`, dismiss closes modal
- [x] 7.4 Write tests for `WildColorModal` (renders 4 colors, calls onSelect with chosen color, dismiss calls onCancel)

## 8. Game Board Interactivity

- [x] 8.1 Add `onCardClick` handler to `PlayerHand`: pass card click events up to `GameBoard`
- [x] 8.2 Implement card click logic in `GameBoard`: if wild → open color modal, if normal playable → submit action, if unplayable → no-op
- [x] 8.3 Add visual dimming for unplayable cards when it's the player's turn (reduced opacity or desaturation)
- [x] 8.4 Add cursor styles: pointer on playable cards and deck, not-allowed on unplayable cards, default when not your turn
- [x] 8.5 Add `onClick` handler to `DeckPile`: submit `DRAW_CARD` action when it's the player's turn
- [x] 8.6 Write tests for card click behavior (playable card, unplayable card, wild card, not your turn)
- [x] 8.6 Write tests for deck click behavior (your turn, not your turn)

## 9. UNO Cosmetic Indicator

- [x] 9.1 Add "UNO!" chat balloon to `OpponentIndicator`: display when `cardCount === 1`
- [x] 9.2 Style balloon: speech bubble appearance with tail, contrasting background, bold compact text
- [x] 9.3 Implement CSS anchor positioning: `anchor-name` on avatar, `position-anchor` on balloon, positioned above-right of avatar
- [x] 9.4 Add fallback positioning: `position: absolute` with `@supports not (anchor-name: ...)` for browsers without anchor positioning
- [x] 9.5 Write tests for UNO balloon (appears at 1 card, hidden at other counts)

## 10. Integration and Cleanup

- [x] 10.1 Wire `useGamePlay` hook into the room page component tree, passing action handlers to `GameBoard`
- [x] 10.2 Ensure `usePlayerHand` write methods (`addCard`, `removeCard`, `setHand`) are only called by the host's game engine (remove or gate peer access)
- [x] 10.3 End-to-end manual testing: play a full game with 3+ players through to win condition
- [x] 10.5 Verify session resilience still works correctly with the new action queue (pause/resume, disconnect handling)
