## 1. Foundation & Types

- [x] 1.1 Create `lib/game/cards.ts` with Card interface and CardColor/CardSymbol types (consolidate from UnoCard.tsx)
- [x] 1.2 Create `lib/game/deck.ts` with `createDeck()` (108 cards) and `shuffle()` functions
- [x] 1.3 Add tests for deck creation (verify composition) and shuffle (verify randomness, all cards present)

## 2. Hand Distribution via Yjs

- [x] 2.1 Add `dealtHands` Y.Map to Yjs document for hand delivery
- [x] 2.2 Host writes all players' hands to `dealtHands` map in a single transaction
- [x] 2.3 Each player's `usePlayerHand` hook observes their own key in `dealtHands`

## 3. Game Engine (Host-Side)

- [x] 3.1 Create `hooks/useGameEngine.ts` for host-only game management
- [x] 3.2 Implement `initializeGame()`: create deck, shuffle, deal to all players
- [x] 3.3 Implement dealing logic: host writes all hands to Yjs `dealtHands` map
- [x] 3.4 Implement first card flip with Wild Draw 4 reshuffle rule
- [x] 3.5 Update Yjs shared state: currentTurn, direction, discardPile, playerCardCounts, turnOrder, lockedPlayers
- [x] 3.6 Add tests for deal logic and turn order initialization

## 4. Game State Extensions

- [x] 4.1 Extend `useGameState.ts` to read new fields (currentTurn, direction, discardPile, playerCardCounts, lockedPlayers)
- [x] 4.2 Create `usePlayerHand.ts` hook for local hand state (reads from Yjs `dealtHands` map)
- [x] 4.3 Add tests for game state observation

## 5. UI Components - Player Hand

- [x] 5.1 Create `components/game/PlayerHand.tsx` - fanned arc of cards
- [x] 5.2 Implement dynamic fan angles based on card count
- [x] 5.3 Card backs rendered via `UnoCard` component with `symbol='back'` variant (no separate `CardBack.tsx`)
- [x] 5.4 Add tests for PlayerHand rendering

## 6. UI Components - Opponents

- [x] 6.1 Create `components/game/OpponentIndicator.tsx` - circular avatar + card count
- [x] 6.2 Implement current turn golden glow highlight
- [x] 6.3 Create `components/game/OpponentRow.tsx` - positions opponents evenly
- [x] 6.4 Add tests for opponent display and turn indicator

## 7. UI Components - Table Center

- [x] 7.1 Create `components/game/TableCenter.tsx` - deck pile + discard pile container
- [x] 7.2 Create `components/game/DiscardPile.tsx` with random rotation/offset for organic look
- [x] 7.3 Create `components/game/DeckPile.tsx` with stacked card backs
- [x] 7.4 Add tests for pile rendering

## 8. Game Board Assembly

- [x] 8.1 Create `components/game/GameBoard.tsx` main layout container
- [x] 8.2 Integrate header, opponents, table center, and player hand
- [x] 8.3 Implement responsive layout (mobile vs desktop)
- [x] 8.4 Replace placeholder in `room/[id]/page.tsx` with GameBoard component

## 9. Integration & Testing

- [x] 9.1 Wire up startGame to trigger host's initializeGame()
- [x] 9.2 Test full flow: create room → join with 3 players → start game → verify all see game board
- [x] 9.3 Verify deck privacy: guests cannot see deck in Yjs state
- [x] 9.4 Verify hand privacy: each player sees only their own cards

## 10. Lobby Lock

- [x] 10.1 Create `components/modals/GameAlreadyStartedModal.tsx` with "Game Already Started" message and home button
- [x] 10.2 Add late joiner detection logic in room page (check clientId against lockedPlayers)
- [x] 10.3 Show GameAlreadyStartedModal and redirect late joiners to home
- [x] 10.4 Test: join room after game starts → verify modal appears and redirect works
