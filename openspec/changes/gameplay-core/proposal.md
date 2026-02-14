## Why

The game board, deck, dealing, session resilience, and lobby are all implemented — but there's no actual gameplay. Cards are decorative, turns never advance, and games can only end by walkover. This change implements the core gameplay loop: playing cards, drawing cards, turn progression, action card effects, wild card color selection, win detection, and UNO call cosmetics.

## What Changes

- Add host-authoritative action queue: peers submit intended actions via Yjs, host validates and executes all game state mutations
- Implement card play validation (color match, symbol match, wild always playable)
- Implement turn advancement with direction awareness (clockwise/counter-clockwise)
- Implement action card effects: Skip (next player skipped), Reverse (direction flips), Draw Two (next player draws 2 and is skipped)
- Implement wild card flow: color picker modal before action submission, Wild Draw Four forces next player to draw 4 and is skipped
- Derive `activeColor` from the top discard card's color in the `useGamePlay` hook (not stored in Yjs)
- Fix Card type: `color` becomes optional (`color?: CardColor`), removing the `'wild'` pseudo-color. Wild cards have no color until played.
- Implement draw card action: player requests draw, host pops from deck and adds to player's hand. Deck reshuffles from discard pile when empty.
- Add card interactivity: clickable cards in hand, clickable deck pile to draw, unplayable cards visually distinguished
- Implement wild card rendering via SVGR: wild SVGs loaded as React components with CSS classes on paths, enabling grayscale-except-chosen-color effect on discard pile
- Implement win condition: player empties hand, game transitions to ENDED with winner set
- Add cosmetic UNO indicator: opponents with 1 card show a "UNO!" chat balloon on their avatar via CSS anchor positioning
- Host becomes sole writer of all game state (`gameStateMap`, `dealtHandsMap`); peers only write to `actionsMap`

## Capabilities

### New Capabilities
- `gameplay-actions`: Action queue system — player action types, Yjs actionsMap, host observation and processing loop
- `gameplay-turns`: Turn progression, direction changes, skip logic, and next-player computation
- `gameplay-card-play`: Card play validation, action card effects (skip, reverse, draw2), draw mechanics, deck reshuffling
- `gameplay-wild-cards`: Wild card color selection modal, SVGR-based wild card rendering with CSS color classes, Wild Draw Four effects
- `gameplay-win-condition`: Empty hand detection, game end transition, winner assignment

### Modified Capabilities
- `game-engine`: Host evolves from dealing-only to full game engine — observes action queue, validates moves, executes all state mutations
- `game-board-ui`: Cards become interactive (click to play), deck becomes clickable (draw), unplayable cards visually distinguished, wild cards on discard show chosen color via grayscale effect
- `uno-button`: UNO button becomes cosmetic-only; opponents with 1 card show "UNO!" chat balloon via CSS anchor positioning on their avatar
- `game-settings`: Card type updated to make `color` optional; `activeColor` derived from top discard (not stored)

## Impact

- **Types**: `Card` interface changes (`color` becomes optional), `CardColorWithWild` type removed, new `PlayerAction` type added
- **Hooks**: New `useGamePlay` hook for action submission + local pre-validation; `useGameEngine` expanded significantly; `usePlayerHand` write methods become host-only
- **Components**: `PlayerHand` gains card click handlers; `DeckPile` gains click handler; new `WildColorModal` component; `DiscardPile` renders played wilds via SVGR; `OpponentIndicator` gains UNO balloon
- **SVG Assets**: Wild card SVGs (`wild.svg`, `wild-draw4.svg`) modified to use CSS classes on color paths instead of inline styles; SVGR configured in Next.js
- **Dependencies**: `@svgr/webpack` added for SVG-as-React-component imports
- **Yjs Document**: New `actionsMap` shared map added
