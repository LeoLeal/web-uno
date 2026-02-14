## Context

The P2P Uno game has a complete foundation: lobby, room management, deck creation, card dealing, session resilience, and game board UI. However, no actual gameplay exists — cards are display-only, turns never advance, and games can only end by walkover. The game uses a "Trusted Dealer" architecture where the host holds the deck in memory and all peers sync state through Yjs CRDTs over WebRTC.

Currently:
- `useGameEngine` handles deck creation, shuffling, dealing, and first card flip (host-only)
- `useGameState` observes the Yjs `gameStateMap` for all players
- `usePlayerHand` reads dealt cards from `dealtHandsMap` and exposes local add/remove helpers
- `GameBoard` renders opponents, table center, and player hand — all display-only
- `UnoCard` renders card SVGs via Next.js `<Image>` (opaque `<img>` tags)
- Wild cards currently use `color: 'wild'` — a pseudo-color that doesn't exist in the real game

## Goals / Non-Goals

**Goals:**
- Implement the complete Uno gameplay loop: play cards, draw cards, advance turns
- All action card effects: Skip, Reverse, Draw Two, Wild, Wild Draw Four
- Host-authoritative validation — no peer can cheat by writing invalid state
- Wild card color selection with visual feedback on the discard pile
- Win detection when a player empties their hand
- Cosmetic UNO indicator on opponent avatars

**Non-Goals:**
- Rule variants (jump-in, stacking, zero/seven swap, force play, multiple card play) — deferred to a future change
- Scoring system / multi-round games — deferred
- UNO call penalties (catching players who forget) — UNO is cosmetic only
- Wild Draw Four challenge mechanic — deferred
- First-card-is-wild explicit color chooser step by first player — wild first card is handled by leaving it colorless (null active color = any card playable)
- Animated card transitions (play/draw animations) — deferred

## Decisions

### Decision 1: Host-Authoritative Command Pattern

**Choice**: Peers submit actions to a shared Yjs map; the host observes, validates, and executes all game state mutations. Peers never write to `gameStateMap` or `dealtHandsMap` during gameplay.

**Alternatives considered**:
- *Player self-validates and mutates directly*: Simpler, lower latency, but any peer could write invalid state. In a casual game this might be fine, but it undermines the Trusted Dealer architecture.
- *Optimistic local + host confirmation*: Complex rollback logic for a card game where latency tolerance is high.

**Rationale**: Uno is turn-based with low action frequency — the round-trip latency for host validation is negligible. Keeping a single writer for game state eliminates conflict resolution complexity and maintains the security guarantee that no peer can see or manipulate the deck.

### Decision 2: Action Queue via Yjs Map (`actionsMap`)

**Choice**: A new Yjs `Y.Map` called `actionsMap` where each player writes their intended action keyed by `String(clientId)`. The host observes this map and processes actions.

**Action schema**:
```typescript
type PlayerAction =
  | { type: 'PLAY_CARD'; cardId: string }
  | { type: 'PLAY_CARD'; cardId: string; chosenColor: CardColor }
  | { type: 'DRAW_CARD' }
```

**Flow**:
1. Player writes action to `actionsMap.set(String(myClientId), action)`
2. Host's observer fires, reads the action
3. Host validates (correct turn, card exists in hand, card is playable)
4. If valid: host executes in a `doc.transact()` — updates discard, hand, counts, turn
5. Host clears the action: `actionsMap.set(String(clientId), null)`
6. If invalid: host clears the action (no explicit rejection feedback)

**Why no rejection feedback**: The client-side UI performs local pre-validation (grays out unplayable cards, disables play when not your turn). Invalid actions reaching the host indicate a bug, not a UX scenario. Adding a rejection channel adds complexity for an edge case that shouldn't occur.

### Decision 3: `activeColor` Derived from Top Discard Card

**Choice**: `activeColor` is NOT stored in `gameStateMap`. It is derived in the `useGamePlay` hook as `topDiscard?.color ?? null`.

**Why this works**: Wild cards get their chosen color baked into the card object before being placed on the discard pile (see Decision 4). Therefore `topDiscard.color` always reflects the active color — there is no scenario where the active color diverges from the top discard card's color.

**Derivation**:
- Normal card on top: `activeColor` = `topDiscard.color` (the card's own color)
- Wild card on top (played): `activeColor` = `topDiscard.color` (the chosen color, mutated onto the card)
- Wild card on top (game start, no color chosen): `activeColor` = `null` (card has no color)

**Card play validation**: `activeColor === null` (any card playable) OR `isWild(card)` OR `card.color === activeColor` OR `card.symbol === topDiscard.symbol`

**When `activeColor` is `null`** (top discard has no color, e.g. wild first card): any card is considered a color match. This allows the first player to play any card when the opening discard is a wild.

### Decision 4: Card Type — Optional Color

**Choice**: Change `Card.color` from `color: CardColorWithWild` to `color?: CardColor`. Remove the `CardColorWithWild` type entirely.

**Card lifecycle for wilds**:
- In deck/hand: `{ id: 'card-99', symbol: 'wild' }` — no `color` property
- After color selection: `{ id: 'card-99', symbol: 'wild', color: 'green' }` — color assigned

**Rationale**: There is no 'wild' color in Uno. A wild card simply has no color until the player chooses one. The `UnoCard` component already treats `color` as optional. This aligns the data model with reality.

### Decision 5: SVGR for Wild Card Rendering

**Choice**: Use `@svgr/webpack` to import wild card SVGs (`wild.svg`, `wild-draw4.svg`) as React components. Modify the SVGs to use CSS classes on color paths instead of inline `style` attributes. Apply CSS classes on a wrapper element to control which quadrants are colored vs. grayscale.

**SVG modifications**:
- Replace `style="fill:#ed1c24"` with `class="quad-red"` (and similarly for blue, yellow, green)
- Apply to both main quadrants and corner mini-quadrants

**CSS approach**:
```css
.quad-red { fill: #ed1c24; }
.quad-blue { fill: #0077c0; }
.quad-yellow { fill: #ffcc00; }
.quad-green { fill: #00a651; }

.chosen-red .quad-blue,
.chosen-red .quad-yellow,
.chosen-red .quad-green { fill: #9ca3af; }
/* ... same pattern for each chosen color */
```

**Rendering logic**:
- Wild cards in hand (no color): render via SVGR with all colors visible
- Wild cards on discard (with color): render via SVGR with `chosen-{color}` class
- All non-wild cards: continue using `<Image>` as before

**Alternatives considered**:
- *Inline SVG manually*: Same result but harder to maintain if SVGs change
- *Pre-generate variant SVG files*: 8 extra files (4 colors × 2 wild types), no CSS flexibility
- *CSS filters on `<img>`*: Can't target individual SVG paths through `<img>` tag

### Decision 6: Wild Color Picker Modal

**Choice**: When a player clicks a wild card in their hand, a modal opens with 4 color buttons (red, blue, green, yellow). Selecting a color submits the `PLAY_CARD` action with the `chosenColor` field. Dismissing the modal cancels the play.

**Flow**:
1. Player clicks wild card → modal opens (card is not yet played)
2. Player selects color → `submitAction({ type: 'PLAY_CARD', cardId, chosenColor })`
3. Host validates → executes (mutates card color, adds to discard)

### Decision 7: Cosmetic UNO Indicator

**Choice**: UNO button remains cosmetic (no penalties). When any player has exactly 1 card, their opponent avatar shows a "UNO!" mini chat balloon using CSS anchor positioning, following the same pattern as `InfoTooltip`.

**Implementation**: The balloon is always visible (not hover-triggered) when `cardCount === 1`. Uses `anchor-name` on the avatar element and `position-anchor` on the balloon, with an absolute-position fallback for browsers without anchor positioning support.

### Decision 8: Turn Advancement Logic

**Choice**: The host computes the next turn after every action, accounting for direction and special effects.

**Turn computation**:
```
nextTurn(turnOrder, currentIndex, direction, skipCount):
  index = currentIndex
  for i in 0..skipCount:
    index = (index + direction) mod turnOrder.length
  return turnOrder[index]
```

**Action card effects on turns**:
- **Skip**: skipCount = 2 (advance past the skipped player)
- **Reverse**: flip direction, then advance 1
- **Draw Two**: host deals 2 cards to next player, skipCount = 2
- **Wild Draw Four**: host deals 4 cards to next player, skipCount = 2
- **Normal card**: skipCount = 1

**Two-player special case**: Reverse acts as Skip (direction flip + advance past the other player effectively skips them).

### Decision 9: Deck Reshuffling

**Choice**: When the host's deck is empty and a draw is needed, take all cards from the discard pile except the top card, shuffle them, and use as the new deck.

**Edge case**: If even after reshuffling the deck is empty (all cards are in players' hands), the draw action fails silently — the player simply cannot draw.

### Decision 10: Hook Architecture

**New hook**: `useGamePlay` — used by all players for action submission and local pre-validation.

**Expanded hook**: `useGameEngine` — host-only, gains action observation and processing loop.

**Modified hook**: `usePlayerHand` — `addCard`, `removeCard`, `setHand` become internal to the host's game engine. Peers only read their hand via Yjs observation.

```
  Peer hooks:                    Host hooks:
  ┌─────────────────────┐       ┌─────────────────────┐
  │ useGamePlay          │       │ useGamePlay          │
  │  - submitAction()    │       │  - submitAction()    │
  │  - canPlayCard()     │       │  - canPlayCard()     │
  │  - activeColor (derived)│    │  - activeColor (derived)│
  │  - isMyTurn          │       │  - isMyTurn          │
  └─────────────────────┘       ├─────────────────────┤
  ┌─────────────────────┐       │ useGameEngine        │
  │ usePlayerHand        │       │  - observeActions()  │
  │  - hand (read-only)  │       │  - validateAction()  │
  └─────────────────────┘       │  - executeAction()   │
                                 │  - advanceTurn()     │
                                 │  - checkWin()        │
                                 │  - reshuffleDeck()   │
                                 └─────────────────────┘
```

## Risks / Trade-offs

**[Host latency]** → Every action round-trips through the host. In a turn-based card game, this adds ~50-200ms per action depending on WebRTC connection quality. Acceptable for the game type. If it becomes noticeable, could add optimistic local updates later.

**[Host disconnection during gameplay]** → If the host disconnects, the deck is lost and no actions can be processed. Existing session resilience handles host disconnect detection. Host migration (transferring deck to another player) is out of scope — the game pauses and waits for the host to return or ends by walkover.

**[SVGR bundle size]** → Importing wild SVGs as React components adds them to the JS bundle instead of being optimized images. Only 2 SVGs (wild + wild-draw4) are affected, and they're small (~2KB each). Negligible impact.

**[Action queue ordering]** → Yjs maps don't guarantee observation order if multiple players write simultaneously. Since Uno is strictly turn-based (only the current player's action is valid), simultaneous writes are rejected by validation. No ordering issue in practice.

**[Card type breaking change]** → Changing `Card.color` from required to optional affects all code that reads card color. TypeScript will flag all access sites, making the migration safe. The `isWildCard()` helper already checks `symbol`, not `color`.
