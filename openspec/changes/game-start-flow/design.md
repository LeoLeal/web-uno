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
- Private hands must be sent via WebRTC data channels (not Yjs, which is shared)
- Public state (discard pile, turn) synced via Yjs for all to see

## Goals / Non-Goals

**Goals:**

- Initialize and shuffle a 108-card Uno deck on host
- Deal starting hands to all players (via private WebRTC messages)
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

### 2. Private Hand Distribution via WebRTC Data Channels

**Decision:** Use `y-webrtc`'s underlying WebRTC connections to send private messages directly to peers.

The host will:

1. Build the deck and shuffle
2. For each player, extract N cards from deck
3. Send a `DEAL_HAND` message to each peer via data channel with their cards
4. Store remaining deck in host's local state (not Yjs)

**Alternatives Considered:**

- **Encrypted Yjs data**: Complex key management, overkill
- **Separate signaling for private data**: Adds infrastructure complexity

**Rationale:** WebRTC data channels already exist via y-webrtc. We can access them to send targeted messages. Keeps "trusted dealer" pattern pure—cards never touch shared state.

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
├── OpponentIndicator.tsx   # Circular avatar + card count
├── TableCenter.tsx         # Deck pile + discard pile
├── DiscardPile.tsx         # Stacked cards with random offset
└── CardBack.tsx            # Card back image component
```

**Hooks:**

```
hooks/
├── useGameEngine.ts        # Host-only deck management, dealing
└── usePrivateMessages.ts   # Send/receive private WebRTC messages
```

### 6. Deal Sequence

When host clicks "Start Game":

1. **Host creates deck** → Shuffle 108 cards
2. **Host determines turn order** → From current `players` array order
3. **Host deals to each player**:
   - Extract N cards from deck
   - Send `DEAL_HAND` message via data channel to that peer
   - If dealing to self (host), just set local state
4. **Host flips first card** → Move top of deck to discard pile
   - If first card is Wild Draw 4, reshuffle and retry
5. **Host sets first turn** → First player in turn order
6. **Host updates Yjs shared state**:
   - `currentTurn`, `direction`, `discardPile`, `playerCardCounts`, `turnOrder`
7. **All peers** → Read shared state, display game board

## Risks / Trade-offs

| Risk                                                   | Mitigation                                                                                                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| WebRTC data channel access is undocumented in y-webrtc | Fallback: Use y-webrtc's broadcast with recipient field, ignore if not for you (less private but functional). Research y-webrtc source first. |
| Player joins mid-deal                                  | Don't allow joins once game starts. Lock lobby.                                                                                               |
| Card back PNG is large (104KB)                         | Acceptable for now. Could optimize to SVG later.                                                                                              |
| Host disconnects after dealing                         | Existing HostDisconnectModal handles this. Game ends.                                                                                         |

## Open Questions

1. **How to access WebRTC data channels from y-webrtc?** → Need to research y-webrtc internals or use `provider.room.webrtcConns` map.
2. **Should we animate the deal?** → Deferred to future change (polish).
