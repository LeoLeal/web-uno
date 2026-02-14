## 1. Card Type and Data Model Updates

- [ ] 1.1 Update `Card` interface: change `color` from `color: CardColorWithWild` to `color?: CardColor`. Remove `CardColorWithWild` type from `cards.ts`
- [ ] 1.2 Update `createDeck()` in `deck.ts`: wild cards created without `color` property instead of `color: 'wild'`
- [ ] 1.3 Define `PlayerAction` discriminated union type (`PLAY_CARD` with `cardId` and optional `chosenColor`, `DRAW_CARD`)
- [ ] 1.4 Fix all TypeScript errors caused by the `Card.color` change across the codebase (components, hooks, tests)
- [ ] 1.5 Update existing tests for card creation and deck to reflect optional color on wild cards
- [ ] 1.6 Write tests for `PlayerAction` type validation helpers (if any utility functions are added)

## 2. Game State Extensions

- [ ] 2.1 Add `activeColor` field to `gameStateMap` in `useGameState` hook (read `activeColor` from Yjs, expose in return value)
- [ ] 2.2 Update `useGameEngine` to set `activeColor` during game initialization (from first discard card's color, or `null` if wild)
- [ ] 2.3 Add `actionsMap` Yjs map: register in `useGameEngine` for host observation, provide write access for peers
- [ ] 2.4 Write tests for `activeColor` initialization (normal first card, wild first card)

## 3. Action Queue and Host Processing

- [ ] 3.1 Create `useGamePlay` hook: `submitAction()`, `canPlayCard()`, `isMyTurn`, `activeColor`, `topDiscard`
- [ ] 3.2 Implement `canPlayCard(card)` local pre-validation: wild always playable, color match, symbol match
- [ ] 3.3 Implement host action observer in `useGameEngine`: observe `actionsMap`, detect new non-null entries
- [ ] 3.4 Implement host action validation: turn check, card ownership check, playability check, wild color check
- [ ] 3.5 Implement host `PLAY_CARD` execution: remove from hand, add to discard, update activeColor, update card counts, apply effects, advance turn — all in one `doc.transact()`
- [ ] 3.6 Implement host `DRAW_CARD` execution: pop from deck, add to player hand, update card counts, advance turn
- [ ] 3.7 Implement deck reshuffle: when deck empty, take all discard except top, shuffle, use as new deck
- [ ] 3.8 Write tests for `canPlayCard()` (color match, symbol match, wild, no match, null activeColor)
- [ ] 3.9 Write tests for host action validation (wrong turn, missing card, unplayable card, wild without color)
- [ ] 3.10 Write tests for host action execution (card play updates state, draw updates state, deck reshuffle)

## 4. Turn Progression and Action Card Effects

- [ ] 4.1 Implement turn advancement: compute next player from `turnOrder`, `currentIndex`, `direction`
- [ ] 4.2 Implement Skip effect: skip next player (advance 2 positions in current direction)
- [ ] 4.3 Implement Reverse effect: flip direction, advance 1 in new direction
- [ ] 4.4 Implement two-player special case: Reverse acts as Skip
- [ ] 4.5 Implement Draw Two effect: deal 2 cards to next player, skip their turn
- [ ] 4.6 Implement Wild Draw Four effect: deal 4 cards to next player, skip their turn
- [ ] 4.7 Write tests for turn advancement (clockwise, counter-clockwise, wraparound)
- [ ] 4.8 Write tests for Skip (normal, two-player)
- [ ] 4.9 Write tests for Reverse (normal, two-player, direction flip)
- [ ] 4.10 Write tests for Draw Two (cards dealt, turn skipped, card counts updated)
- [ ] 4.11 Write tests for Wild Draw Four (cards dealt, turn skipped, activeColor set)

## 5. Win Condition

- [ ] 5.1 Implement win detection in host action execution: after card play, check if player's hand is empty
- [ ] 5.2 Implement game end transition: set `status` to `ENDED`, set `winner`, stop processing actions
- [ ] 5.3 Ensure action card effects are applied before win (Draw Two/Wild Draw Four still force draws even on last card)
- [ ] 5.4 Write tests for win by normal card, win by action card, win by wild card
- [ ] 5.5 Write test that no actions are processed after game end

## 6. SVGR Setup and Wild Card Rendering

- [ ] 6.1 Install `@svgr/webpack` and configure in `next.config.ts` for SVG-as-component imports
- [ ] 6.2 Modify `wild.svg`: replace inline `style` fill attributes with CSS classes (`quad-red`, `quad-blue`, `quad-yellow`, `quad-green`) on all color paths (main quadrants and corner mini-quadrants)
- [ ] 6.3 Modify `wild-draw4.svg`: same CSS class treatment as `wild.svg`
- [ ] 6.4 Create CSS module for wild card colors: base `.quad-*` fill rules and `.chosen-{color}` override rules (grayscale non-chosen quadrants)
- [ ] 6.5 Create `WildCardSvg` component: imports wild SVGs via SVGR, accepts `symbol`, `color`, `size`, `className` props, applies `chosen-{color}` class when color is defined
- [ ] 6.6 Update `UnoCard` component: render wild cards via `WildCardSvg` component instead of `<Image>`, non-wild cards continue using `<Image>`
- [ ] 6.7 Write tests for `WildCardSvg` rendering (no color = all colors visible, with color = chosen class applied)

## 7. Wild Color Picker Modal

- [ ] 7.1 Create `WildColorModal` component: modal with 4 color buttons (red, blue, green, yellow), dismiss to cancel
- [ ] 7.2 Style color buttons: each button filled with its respective color, clear visual affordance
- [ ] 7.3 Wire modal into `GameBoard`: clicking a wild card opens modal, selecting color triggers `submitAction` with `chosenColor`, dismiss closes modal
- [ ] 7.4 Write tests for `WildColorModal` (renders 4 colors, calls onSelect with chosen color, dismiss calls onCancel)

## 8. Game Board Interactivity

- [ ] 8.1 Add `onCardClick` handler to `PlayerHand`: pass card click events up to `GameBoard`
- [ ] 8.2 Implement card click logic in `GameBoard`: if wild → open color modal, if normal playable → submit action, if unplayable → no-op
- [ ] 8.3 Add visual dimming for unplayable cards when it's the player's turn (reduced opacity or desaturation)
- [ ] 8.4 Add cursor styles: pointer on playable cards and deck, not-allowed on unplayable cards, default when not your turn
- [ ] 8.5 Add `onClick` handler to `DeckPile`: submit `DRAW_CARD` action when it's the player's turn
- [ ] 8.6 Update `DiscardPile` to render wild cards with `WildCardSvg` when the top card is a wild with assigned color
- [ ] 8.7 Write tests for card click behavior (playable card, unplayable card, wild card, not your turn)
- [ ] 8.8 Write tests for deck click behavior (your turn, not your turn)

## 9. UNO Cosmetic Indicator

- [ ] 9.1 Add "UNO!" chat balloon to `OpponentIndicator`: display when `cardCount === 1`
- [ ] 9.2 Style balloon: speech bubble appearance with tail, contrasting background, bold compact text
- [ ] 9.3 Implement CSS anchor positioning: `anchor-name` on avatar, `position-anchor` on balloon, positioned above-right of avatar
- [ ] 9.4 Add fallback positioning: `position: absolute` with `@supports not (anchor-name: ...)` for browsers without anchor positioning
- [ ] 9.5 Write tests for UNO balloon (appears at 1 card, hidden at other counts)

## 10. Integration and Cleanup

- [ ] 10.1 Wire `useGamePlay` hook into the room page component tree, passing action handlers to `GameBoard`
- [ ] 10.2 Ensure `usePlayerHand` write methods (`addCard`, `removeCard`, `setHand`) are only called by the host's game engine (remove or gate peer access)
- [ ] 10.3 Update `useGameEngine` `initializeGame()` to set `activeColor` in the initial transaction
- [ ] 10.4 End-to-end manual testing: play a full game with 3+ players through to win condition
- [ ] 10.5 Verify session resilience still works correctly with the new action queue (pause/resume, disconnect handling)
