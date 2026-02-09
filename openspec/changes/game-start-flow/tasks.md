## 1. Foundation & Types

- [ ] 1.1 Create `lib/game/cards.ts` with Card interface and CardColor/CardSymbol types (consolidate from UnoCard.tsx)
- [ ] 1.2 Create `lib/game/deck.ts` with `createDeck()` (108 cards) and `shuffle()` functions
- [ ] 1.3 Add tests for deck creation (verify composition) and shuffle (verify randomness, all cards present)

## 2. Private Messaging Infrastructure

- [ ] 2.1 Create `hooks/usePrivateMessages.ts` hook to send/receive WebRTC data channel messages
- [ ] 2.2 Define message types: `DEAL_HAND` with Card[] payload in `lib/game/messages.ts`
- [ ] 2.3 Integrate with y-webrtc provider to access peer connections

## 3. Game Engine (Host-Side)

- [ ] 3.1 Create `hooks/useGameEngine.ts` for host-only game management
- [ ] 3.2 Implement `initializeGame()`: create deck, shuffle, deal to all players
- [ ] 3.3 Implement dealing logic: extract cards for each player, send via private message
- [ ] 3.4 Implement first card flip with Wild Draw 4 reshuffle rule
- [ ] 3.5 Update Yjs shared state: currentTurn, direction, discardPile, playerCardCounts, turnOrder
- [ ] 3.6 Add tests for deal logic and turn order initialization

## 4. Game State Extensions

- [ ] 4.1 Extend `useGameState.ts` to read new fields (currentTurn, direction, discardPile, playerCardCounts)
- [ ] 4.2 Create `usePlayerHand.ts` hook for local hand state (receives from private messages)
- [ ] 4.3 Add tests for game state observation

## 5. UI Components - Player Hand

- [ ] 5.1 Create `components/game/PlayerHand.tsx` - fanned arc of cards
- [ ] 5.2 Implement dynamic fan angles based on card count
- [ ] 5.3 Create `components/game/CardBack.tsx` component using `uno_card_back.png`
- [ ] 5.4 Add tests for PlayerHand rendering

## 6. UI Components - Opponents

- [ ] 6.1 Create `components/game/OpponentIndicator.tsx` - circular avatar + card count
- [ ] 6.2 Implement current turn golden glow highlight
- [ ] 6.3 Create `components/game/OpponentRow.tsx` - positions opponents evenly
- [ ] 6.4 Add tests for opponent display and turn indicator

## 7. UI Components - Table Center

- [ ] 7.1 Create `components/game/TableCenter.tsx` - deck pile + discard pile container
- [ ] 7.2 Create `components/game/DiscardPile.tsx` with random rotation/offset for organic look
- [ ] 7.3 Create `components/game/DeckPile.tsx` with stacked card backs
- [ ] 7.4 Add tests for pile rendering

## 8. Game Board Assembly

- [ ] 8.1 Create `components/game/GameBoard.tsx` main layout container
- [ ] 8.2 Integrate header, opponents, table center, and player hand
- [ ] 8.3 Implement responsive layout (mobile vs desktop)
- [ ] 8.4 Replace placeholder in `room/[id]/page.tsx` with GameBoard component

## 9. Integration & Testing

- [ ] 9.1 Wire up startGame to trigger host's initializeGame()
- [ ] 9.2 Test full flow: create room → join with 3 players → start game → verify all see game board
- [ ] 9.3 Verify deck privacy: guests cannot see deck in Yjs state
- [ ] 9.4 Verify hand privacy: each player sees only their own cards
