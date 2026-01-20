# Player Hand Specification

## Overview

**Title**: Player Hand

**Type**: Component

**Status**: Draft

**Priority**: High

**Estimated Effort**: Medium

**Date Created**: 2026-01-20

**Last Updated**: 2026-01-20

### Description
Define the React component for displaying and interacting with a player's Uno card hand, including card selection, playing, and responsive layouts.

### Goals
- Provide intuitive card hand management
- Enable smooth card selection and playing
- Support different hand sizes and layouts
- Ensure optimal user experience across devices

### Dependencies
- Game State Types (specs/types/game-state-types.md) - Player and card data
- Card Components (specs/components/card-components.md) - Individual card rendering
- Uno Logic Rules (specs/game/uno-logic-rules.md) - Play validation
- Coding Standards (specs/coding-standards.md) - Implementation guidelines

## Requirements

### Functional Requirements
- [FR-001] Display player's current hand of cards
- [FR-002] Highlight playable cards based on game rules
- [FR-003] Allow card selection for playing
- [FR-004] Support card playing action
- [FR-005] Provide compact and comfortable layout options
- [FR-006] Update in real-time with hand changes
- [FR-007] Handle empty hand states

### Non-Functional Requirements
- [NFR-001] Smooth scrolling for large hands
- [NFR-002] Touch-friendly card interactions on mobile
- [NFR-003] Performance with hands up to 30+ cards
- [NFR-004] Accessibility with keyboard navigation

### User Stories
- As a player, I want to see my cards clearly so that I can choose which to play
- As a player, I want to know which cards I can play so that I make valid moves
- As a mobile player, I want easy card selection so that I can play comfortably

## Technical Specification

### API Interface
```typescript
interface PlayerHandProps {
  player: Player
  isCurrentPlayer: boolean
  playableCards: Card[]
  onCardSelect: (card: Card) => void
  onCardPlay: (card: Card) => void
  handSize?: 'compact' | 'comfortable'
}

const PlayerHand: React.FC<PlayerHandProps> = ({ player, ...props }) => {
  // Player's card hand with selection and play interface
}
```

### Data Structures
```typescript
// From game state types
interface Player {
  id: string
  name: string
  hand: Card[]
}

interface Card {
  id: string
  color: CardColor
  value: CardValue
}
```

### Component Structure
```typescript
const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  isCurrentPlayer,
  playableCards,
  onCardSelect,
  onCardPlay,
  handSize = 'comfortable'
}) => {
  const playableCardIds = new Set(playableCards.map(c => c.id))

  return (
    <div className={`player-hand ${handSize}`}>
      <h3>{player.name}'s Hand</h3>
      <div className="hand-cards">
        {player.hand.map(card => (
          <UnoCard
            key={card.id}
            card={card}
            isPlayable={isCurrentPlayer && playableCardIds.has(card.id)}
            onClick={() => isCurrentPlayer && onCardSelect(card)}
            disabled={!isCurrentPlayer}
          />
        ))}
      </div>
      {isCurrentPlayer && (
        <HandActions onCardPlay={onCardPlay} selectedCard={selectedCard} />
      )}
    </div>
  )
}
```

### State Management
- Local state for selected card
- Props-driven for hand data and playable status
- No server state management

### Error Handling
- Handle empty hands gracefully
- Fallback for missing card data

## Implementation Notes

### Architecture Decisions
- Flexible layout system for different screen sizes
- Virtualization for very large hands if needed
- Event bubbling for card interactions

### Design Patterns
- Render props for customizable card rendering
- Higher-order component for hand size variants
- Callback props for action handling

### Code Organization
- `src/components/hand/PlayerHand.tsx` - Main hand component
- `src/components/hand/HandActions.tsx` - Play/cancel buttons
- `src/components/hand/handLayouts.ts` - Layout algorithms

### Testing Strategy
- Unit tests for playable card logic
- Integration tests with mock hands
- Visual tests for layout variations

## Acceptance Criteria

### Visual Design
- [ ] Cards display in organized layout
- [ ] Playable cards have visual indicators
- [ ] Hand size options work correctly
- [ ] Empty hand shows appropriate message

### Interactions
- [ ] Card selection works on click/touch
- [ ] Only current player can interact
- [ ] Play actions trigger correctly
- [ ] Smooth scrolling for large hands

### Performance
- [ ] Renders quickly with full hands
- [ ] No lag during rapid interactions
- [ ] Memory efficient with many cards

### Accessibility
- [ ] Keyboard navigation between cards
- [ ] Screen reader support for hand contents
- [ ] Focus management for interactions

## References

- [Game State Types](specs/types/game-state-types.md)
- [Card Components](specs/components/card-components.md)
- [Uno Logic Rules](specs/game/uno-logic-rules.md)
- [Responsive Design Patterns](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

*Spec Version: 1.0 | Status: Draft | Ready for Implementation*</content>
<parameter name="filePath">specs/components/player-hand.md