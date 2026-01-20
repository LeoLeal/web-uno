# Game Board Specification

## Overview

**Title**: Game Board

**Type**: Component

**Status**: Draft

**Priority**: High

**Estimated Effort**: Medium

**Date Created**: 2026-01-20

**Last Updated**: 2026-01-20

### Description
Define the React component for the main Uno game board, displaying the discard pile, current card, and action buttons for gameplay.

### Goals
- Provide clear visual representation of game state
- Enable intuitive card playing and drawing actions
- Support responsive layout for different screen sizes
- Maintain real-time synchronization with game state

### Dependencies
- Game State Types (specs/types/game-state-types.md) - Game state and player data
- Card Components (specs/components/card-components.md) - For displaying cards
- Uno Logic Rules (specs/game/uno-logic-rules.md) - Game action validation
- Coding Standards (specs/coding-standards.md) - Implementation guidelines

## Requirements

### Functional Requirements
- [FR-001] Display the current card from discard pile
- [FR-002] Show discard pile with card count
- [FR-003] Provide draw card button for current player
- [FR-004] Include call Uno button when appropriate
- [FR-005] Display game phase indicators (e.g., direction, current player)
- [FR-006] Support responsive layout adjustments
- [FR-007] Update in real-time with game state changes

### Non-Functional Requirements
- [NFR-001] Smooth animations for card plays and draws
- [NFR-002] Touch-friendly button sizes on mobile
- [NFR-003] Performance with rapid state updates
- [NFR-004] Accessibility with clear action labels

### User Stories
- As a player, I want to see the current game state clearly so that I can make informed decisions
- As the current player, I want easy access to draw and play actions so that I can play quickly
- As a player, I want to know when to call Uno so that I don't forget

## Technical Specification

### API Interface
```typescript
interface GameBoardProps {
  gameState: UnoGameState
  onCardPlay: (card: Card) => void
  onDrawCard: () => void
  onCallUno: () => void
  currentPlayer: Player
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, ...actions }) => {
  // Main game area with discard pile, current card, action buttons
}
```

### Data Structures
```typescript
// From game state types
interface UnoGameState {
  currentCard: Card
  discardPile: Card[]
  direction: 'clockwise' | 'counterclockwise'
  currentPlayerId: string
  phase: GamePhase
}

interface Player {
  id: string
  name: string
  hand: Card[]
}
```

### Component Structure
```typescript
const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCardPlay, onDrawCard, onCallUno, currentPlayer }) => {
  const canDraw = gameState.currentPlayerId === currentPlayer.id
  const canCallUno = currentPlayer.hand.length === 2

  return (
    <div className="game-board">
      <DiscardPile cards={gameState.discardPile} currentCard={gameState.currentCard} />
      <GameActions
        canDraw={canDraw}
        canCallUno={canCallUno}
        onDrawCard={onDrawCard}
        onCallUno={onCallUno}
      />
      <DirectionIndicator direction={gameState.direction} />
    </div>
  )
}
```

### State Management
- Props-driven updates from parent game state
- Local state for animation triggers
- No internal state management (stateless component)

### Error Handling
- Graceful handling of invalid game states
- Fallback UI for missing card data

## Implementation Notes

### Architecture Decisions
- Stateless component receiving game state as props
- Separation of concerns with sub-components for actions and display
- Animation library integration for smooth transitions

### Design Patterns
- Container/presentational component split
- Props drilling for action handlers
- Event delegation for card interactions

### Code Organization
- `src/components/game/GameBoard.tsx` - Main board component
- `src/components/game/DiscardPile.tsx` - Discard pile display
- `src/components/game/DirectionIndicator.tsx` - Direction arrow
- `src/hooks/useGameAnimations.ts` - Animation logic

### Testing Strategy
- Unit tests for conditional rendering logic
- Integration tests with mock game state
- E2E tests for action button functionality

## Acceptance Criteria

### Visual Design
- [ ] Current card prominently displayed
- [ ] Discard pile shows card back with count
- [ ] Action buttons clearly visible and labeled
- [ ] Direction indicator updates correctly

### Interactions
- [ ] Draw button enabled only for current player
- [ ] Call Uno button appears when appropriate
- [ ] Buttons trigger correct actions
- [ ] Responsive to screen size changes

### Performance
- [ ] Renders quickly with state updates
- [ ] Animations don't impact gameplay
- [ ] Memory usage stable during long games

### Accessibility
- [ ] Action buttons have clear labels
- [ ] Keyboard navigation support
- [ ] Screen reader announcements for state changes

## References

- [Game State Types](specs/types/game-state-types.md)
- [Card Components](specs/components/card-components.md)
- [Uno Logic Rules](specs/game/uno-logic-rules.md)
- [Material Design Guidelines](https://material.io/design)

---

*Spec Version: 1.0 | Status: Draft | Ready for Implementation*</content>
<parameter name="filePath">specs/components/game-board.md