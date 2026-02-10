## Context

The lobby system is complete: players connect via WebRTC/Yjs, host is established, game settings are configured. When the host clicks "Start Game", the status flips to `PLAYING` but players see only a placeholder. We need to implement the actual game initialization and display.

**Current State:**

- `useGameState.ts` has `startGame()` that sets `gameState.status = 'PLAYING'`
- `UnoCard.tsx` renders individual cards with color/symbol
- `CardFan.tsx` shows a decorative card fan (hardcoded demo cards)
- Card SVGs exist for all 55 Uno cards + card back PNG
- Players are tracked via Yjs Awareness with names/avatars

**Constraints:**

- "Trusted Dealer" model: Host holds deck in memory, guests never see it
- Hands distributed via Yjs `dealtHands` map (pragmatic for friendly games; privacy enhancement deferred)
- Public state (discard pile, turn) synced via Yjs for all to see

## Goals / Non-Goals

**Goals:**

- Initialize and shuffle a 108-card Uno deck on host
- Deal starting hands to all players (via Yjs `dealtHands` map)
- Flip first card to discard pile and set first player's turn
- Display game board with player's hand, opponent indicators, deck, and discard pile
- All players see the same public state (top of discard, whose turn, card counts)

**Non-Goals:**

- Playing cards, drawing from deck
- Game rules enforcement (skip, reverse, +2, etc.)
- Turn progression, win conditions
- Animations for dealing (future polish)

## Decisions

### 1. Deck Data Structure

**Decision:** Use a simple array of card objects on host only.

```typescript
interface Card {
  id: string; // Unique ID for tracking
  color: CardColor; // 'red' | 'blue' | 'green' | 'yellow' | 'wild'
  symbol: CardSymbol; // '0'-'9', 'skip', 'reverse', 'draw2', 'wild', 'wild-draw4'
}
```

**Rationale:** Keep it simple. ID needed to track which cards go where. Standard Uno deck composition (108 cards).

### 2. Hand Distribution via Yjs `dealtHands` Map

**Decision:** Host writes each player's hand to a Yjs Y.Map keyed by clientId. Each player's `usePlayerHand` hook observes only their own key.

**Implementation:**

1. Host creates the `dealtHands` Y.Map in a single Yjs transaction along with all other game state
2. Each player's `usePlayerHand` hook observes `dealtHands.get(String(myClientId))`
3. Hands are delivered as soon as the Yjs transaction syncs to peers

**Why not WebRTC private channels?**

y-webrtc registers its own `data` event handler on every SimplePeer connection. This handler consumes all incoming data and parses it as y-webrtc protocol messages. Custom messages sent via `conn.peer.send()` are intercepted and discarded before any custom listener runs. Piggybacking custom data on y-webrtc's data channels is not viable without forking the library.

**Tradeoff:** Hands are in shared Yjs state, so a peer with dev tools could inspect other players' hands. Acceptable for friendly games. A future enhancement will add either per-player encryption or a separate WebRTC data channel for true privacy.

### 3. Public Game State in Yjs

**Decision:** Add to `gameState` Y.Map:

```
gameState {
  status: 'LOBBY' | 'PLAYING' | 'ENDED'
  hostId: number
  currentTurn: number        // clientId of player whose turn it is
  direction: 1 | -1          // Play direction (for reverse cards later)
  discardPile: Card[]        // Top cards visible to all (store last few for visual)
  playerCardCounts: Map<number, number>  // clientId → card count
  turnOrder: number[]        // Ordered list of player clientIds
  lockedPlayers: { clientId: number, name: string }[]  // Players at game start (for lobby lock + future handover)
}
```

**Rationale:** Yjs handles sync automatically. All UI reads from this. Host writes, guests observe.

### 4. Game Board Layout

**Decision:** CSS grid/flexbox responsive layout:

```
┌─────────────────────────────────────────────────────────────────┐
│  Header (existing - room code, connection status, leave btn)   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│     ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐            │
│     │ 👤  │   │ 👤  │   │ 👤  │   │ 👤  │   │ 👤  │  Opponents │
│     │  5  │   │  3  │   │  7  │   │  4  │   │  2  │  (top row) │
│     └─────┘   └─────┘   └─────┘   └─────┘   └─────┘            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌─────────────────┐                          │
│                    │   🎴    🃏      │  ← Table Center         │
│                    │  deck  discard  │     (deck + discard)     │
│                    └─────────────────┘                          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│          ╭──────────────────────────────────────╮               │
│         ╱  🂡  🂢  🂣  🂤  🂥  🂦  🂧  ╲              │
│        ╱  Player's Hand (fanned arc)            ╲             │
│       ╰──────────────────────────────────────────╯              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Opponent Positioning:** All opponents in a horizontal row at the top, evenly spaced.

**Current Turn Indicator:** Golden border + glow (`ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]`)

**Discard Pile Aesthetic:** Stack last 3-5 cards with:

- Random rotation: `rotate(${Math.random() * 20 - 10}deg)`
- Small position offset: `translate(${rand}px, ${rand}px)`

### 5. Component Structure

```
components/game/
├── GameBoard.tsx           # Main container, layout manager
├── PlayerHand.tsx          # Fanned arc of player's cards
├── OpponentIndicator.tsx   # Circular avatar + card count + host crown
├── OpponentRow.tsx         # Horizontal row of opponents
├── TableCenter.tsx         # Deck pile + discard pile
├── DiscardPile.tsx         # Stacked cards with random offset
└── DeckPile.tsx            # Stacked card backs
```

**Hooks:**

```
hooks/
├── useGameEngine.ts        # Host-only deck management, dealing via Yjs
└── usePlayerHand.ts        # Local hand state (reads from Yjs dealtHands map)
```

### 6. Deal Sequence

When host clicks "Start Game":

1. **Host creates deck** → Shuffle 108 cards
2. **Host determines turn order** → From current `players` array order
3. **Host deals to each player**:
   - Extract N cards from deck
   - Write all hands to Yjs `dealtHands` map in a single transaction
4. **Host flips first card** → Move top of deck to discard pile
   - If first card is Wild Draw 4, reshuffle and retry
5. **Host sets first turn** → First player in turn order
6. **Host updates Yjs shared state**:
   - `currentTurn`, `direction`, `discardPile`, `playerCardCounts`, `turnOrder`
7. **All peers** → Read shared state, display game board

## Risks / Trade-offs

| Risk                               | Mitigation                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Hands in Yjs are not truly private | Acceptable for friendly games. Future: add per-player encryption or separate data channel. |
| Player joins mid-deal              | Don't allow joins once game starts. Lock lobby.                                            |
| Card back PNG is large (104KB)     | Acceptable for now. Could optimize to SVG later.                                           |
| Host disconnects after dealing     | Existing HostDisconnectModal handles this. Game ends.                                      |

## Open Questions

1. ~~**How to access WebRTC data channels from y-webrtc?**~~ → **ABANDONED**: y-webrtc consumes all SimplePeer data events internally; custom messages cannot coexist. Hands are distributed via Yjs instead.
2. **Should we animate the deal?** → Deferred to future change (polish).
