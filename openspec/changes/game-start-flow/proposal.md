## Why

When the host clicks "Start Game", the status changes to `PLAYING` but nothing actually happens—players see a placeholder. We need to implement the initial game setup: creating the deck, dealing hands, and displaying the game board so players see their cards and are ready to play.

## What Changes

- Create the deck (108 cards) on the host's side only (Trusted Dealer pattern)
- Deal cards to each player based on `startingHandSize` setting
- Flip the first card to start the discard pile
- Sync public game state (discard pile, current turn, card counts) via Yjs
- Send private hand data to each player via direct WebRTC messages
- Display the game board UI:
  - **Header**: Keep existing lobby header as-is
  - **Player's hand**: Cards fanned in an arc at bottom (as if held in hand)
  - **Opponents**: Circular avatars arranged around viewport edge, evenly spaced
  - **Turn indicator**: Current player's avatar has golden border + glow
  - **Opponent cards**: Show card count using smaller card-back images below each avatar
  - **Center table**:
    - Deck pile (stacked card backs)
    - Discard pile (cards with random rotation/position for organic look)

**Out of scope** (future changes):

- Playing cards, drawing, special card effects
- Turn progression, game rules enforcement
- Win conditions

## Capabilities

### New Capabilities

- `game-engine`: Core game state (deck creation, dealing, turn order initialization)
- `game-board-ui`: Game board layout with hand fan, opponent display, table center

### Modified Capabilities

- `p2p-networking`: Add private messaging for hand distribution (Host → Player)

## Impact

- **New files**: Card types, deck utilities, game board components, hand display
- **Modified**: `useGameState.ts`, `room/[id]/page.tsx`, `useRoom.ts` for data channels
- **State**: New Yjs maps for public game state (discardPile, currentTurn, playerCardCounts)
- **Assets**: Card images (front faces + back)
