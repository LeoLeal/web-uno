# Card Components Specification

## Overview

**Title**: Card Components

**Type**: Component

**Status**: Draft

**Priority**: High

**Estimated Effort**: Medium

**Date Created**: 2026-01-20

**Last Updated**: 2026-01-20

### Description
Define the React components for displaying and interacting with Uno cards, including proper styling, sizing, and accessibility features.

### Goals
- Render Uno cards with accurate colors, symbols, and visual hierarchy
- Support multiple sizes for different contexts (hand, board, etc.)
- Provide smooth interactions and visual feedback
- Ensure accessibility for all users

### Dependencies
- Game State Types (specs/types/game-state-types.md) - Card data structures
- Coding Standards (specs/coding-standards.md) - Implementation guidelines

## Requirements

### Functional Requirements
- [FR-001] Display Uno cards with correct colors (red, blue, green, yellow, wild)
- [FR-002] Show card values and symbols (numbers, action cards, wild cards)
- [FR-003] Support multiple card sizes (small, medium, large)
- [FR-004] Indicate playable cards with visual cues
- [FR-005] Show selected state with highlighting
- [FR-006] Handle click interactions for card selection/play
- [FR-007] Support disabled state for non-interactive cards

### Non-Functional Requirements
- [NFR-001] Render cards smoothly with 50+ cards on screen
- [NFR-002] Maintain consistent aspect ratios across sizes
- [NFR-003] Accessibility support (ARIA labels, keyboard navigation)
- [NFR-004] Responsive design for mobile and desktop

### User Stories
- As a player, I want to see clear card representations so that I can identify them easily
- As a player, I want visual feedback when hovering/selecting cards so that I know my actions
- As a mobile user, I want appropriately sized cards so that I can play comfortably

## Technical Specification

### API Interface
```typescript
interface CardProps {
  card: Card
  size?: 'small' | 'medium' | 'large'
  isPlayable?: boolean
  isSelected?: boolean
  onClick?: () => void
  disabled?: boolean
}

const UnoCard: React.FC<CardProps> = ({ card, size = 'medium', ...props }) => {
  // Card rendering with proper Uno styling
}
```

### Data Structures
```typescript
// From game state types
interface Card {
  id: string
  color: CardColor
  value: CardValue
  type: 'number' | 'action' | 'wild'
}
```

### Component Structure
```typescript
const UnoCard: React.FC<CardProps> = ({ card, size = 'medium', isPlayable, isSelected, onClick, disabled }) => {
  const cardStyles = getCardStyles(card, size, isPlayable, isSelected, disabled)
  const symbol = getCardSymbol(card)

  return (
    <button
      className={cardStyles}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Uno card: ${card.color} ${card.value}`}
    >
      {symbol}
    </button>
  )
}
```

### Styling and Theming
```typescript
const UNO_COLORS = {
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#ca8a04',
  wild: '#7c3aed',
  black: '#1f2937',
} as const

const getCardStyles = (card: Card, size: CardSize, isPlayable: boolean, isSelected: boolean, disabled: boolean): string => {
  // Dynamic CSS classes based on card properties
}
```

## Implementation Notes

### Architecture Decisions
- Pure functional component with memoization for performance
- CSS-in-JS for dynamic styling based on props
- Accessibility-first with semantic HTML and ARIA attributes

### Design Patterns
- Props-based styling configuration
- Icon/symbol mapping for card values
- Conditional rendering for states

### Code Organization
- `src/components/cards/UnoCard.tsx` - Main card component
- `src/components/cards/cardStyles.ts` - Styling utilities
- `src/components/cards/cardSymbols.ts` - Symbol/icon mappings

### Testing Strategy
- Unit tests for styling logic and prop handling
- Visual regression tests for card rendering
- Accessibility tests for screen reader support

## Acceptance Criteria

### Visual Design
- [ ] Cards display correct colors and symbols
- [ ] Different sizes maintain proportions
- [ ] Playable/selected states have clear visual indicators
- [ ] Disabled cards are visually distinct

### Interactions
- [ ] Click events fire correctly for enabled cards
- [ ] Keyboard navigation works
- [ ] Touch interactions smooth on mobile

### Performance
- [ ] Cards render quickly in large hands
- [ ] No layout shifts during state changes
- [ ] Memory usage reasonable with many cards

### Accessibility
- [ ] Screen readers announce card details
- [ ] Keyboard-only interaction possible
- [ ] High contrast support

## References

- [Game State Types](specs/types/game-state-types.md)
- [Uno Card Designs](https://www.unorules.com/uno-cards/)
- [React Accessibility](https://react.dev/learn/accessibility)
- [CSS-in-JS Best Practices](https://styled-components.com/docs/basics)

---

*Spec Version: 1.0 | Status: Draft | Ready for Implementation*</content>
<parameter name="filePath">specs/components/card-components.md