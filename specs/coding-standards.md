# Coding Standards and Guidelines Specification

## Overview

**Title**: Coding Standards and Guidelines

**Type**: Guidelines

**Status**: Approved

**Priority**: High

**Estimated Effort**: Small

**Date Created**: 2026-01-20

**Last Updated**: 2026-01-20

### Description
This specification defines the coding standards, style guidelines, and best practices for the Web Uno multiplayer game project. It covers language conventions, file structure, naming, TypeScript usage, component patterns, error handling, testing, performance, security, and commit guidelines.

### Goals
- Ensure consistent code quality across the project
- Improve code readability and maintainability
- Establish best practices for TypeScript and React development
- Facilitate collaboration among developers

### Dependencies
- None

## Requirements

### Functional Requirements
- [FR-001] All code must follow the established naming conventions
- [FR-002] TypeScript strict mode must be enabled
- [FR-003] Components must use functional patterns with hooks
- [FR-004] Error handling must be implemented appropriately
- [FR-005] Tests must follow the specified guidelines

### Non-Functional Requirements
- [NFR-001] Code must be performant and optimized
- [NFR-002] Security best practices must be followed
- [NFR-003] Code must be accessible and maintainable

## Technical Specification

### Language & Framework
- **Primary Language**: TypeScript (strict mode enabled)
- **Framework**: Next.js 16 with React 19
- **State Management**: React Context API with hooks
- **Styling**: Tailwind CSS with emotion/styled-components

### File Structure
```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── constants/     # Game constants and configuration
├── game/          # Game logic and rules
├── multiplayer/   # WebSocket/real-time functionality
└── assets/        # Static assets (images, fonts)
```

### Naming Conventions

#### Components
- Use PascalCase for component names: `GameBoard`, `PlayerHand`
- File names use kebab-case: `game-board.tsx` exports `GameBoard`
- Hook files use kebab-case with `use` prefix: `use-game-state.ts`

#### Variables & Functions
- camelCase for variables and functions: `playerCards`, `calculateScore()`
- PascalCase for types and interfaces: `GameState`, `PlayerInfo`
- SCREAMING_SNAKE_CASE for constants: `MAX_PLAYERS`, `CARD_COLORS`

#### Files
- Component files: `kebab-case.tsx`
- Utility files: `kebab-case.ts`
- Test files: `component-name.test.ts` or `component-name.spec.ts`

### Imports & Dependencies

#### Import Order
1. React imports first
2. Third-party libraries (alphabetically sorted)
3. Local imports (components, utils, types)
4. Relative imports (sibling files)

```typescript
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { shuffle } from 'lodash';

import { GameState, Player } from '../types/game';
import { calculateScore } from '../utils/gameLogic';
import { useWebSocket } from '../hooks/useWebSocket';
```

#### Import Style
- Use named imports over default imports when possible
- Group related imports together
- Avoid wildcard imports (`import * as React from 'react'`)

### TypeScript Guidelines

#### Type Definitions
- Define interfaces for complex objects
- Use union types for variant data
- Prefer `type` over `interface` for simple unions

```typescript
type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
type CardValue = number | 'skip' | 'reverse' | 'draw-two' | 'wild' | 'wild-draw-four';

interface Card {
  id: string;
  color: CardColor;
  value: CardValue;
  points: number;
}
```

#### Type Safety
- Enable strict null checks
- The type `any` should be avoided as much as possible; use `unknown` when type is uncertain
- Never use TypeScript enums; use union types or const assertions instead
- Avoid `as` type assertions unless absolutely necessary
- Use utility types: `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`

### Component Patterns

#### Functional Components
- Use arrow function syntax
- Prefer hooks over class components
- Destructure props at function signature

```typescript
interface PlayerCardProps {
  card: Card;
  onPlay: (card: Card) => void;
  disabled?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ card, onPlay, disabled = false }) => {
  const handleClick = () => !disabled && onPlay(card);

  return (
    <div className="player-card" onClick={handleClick}>
      {/* Card rendering logic */}
    </div>
  );
};
```

#### Custom Hooks
- Extract complex logic into custom hooks
- Follow `use*` naming convention
- Return objects with descriptive property names

```typescript
const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const playCard = useCallback((card: Card) => {
    // Game logic here
    setGameState(prev => ({ ...prev, currentCard: card }));
  }, []);

  return {
    gameState,
    playCard,
    // other actions...
  };
};
```

### Error Handling

#### Try-Catch Blocks
- Use try-catch for async operations
- Handle errors gracefully in UI components
- Log errors appropriately (development vs production)

```typescript
const handleGameAction = async (action: GameAction) => {
  try {
    await gameSocket.emit('game-action', action);
  } catch (error) {
    console.error('Failed to send game action:', error);
    // Show user-friendly error message
    setError('Failed to perform action. Please try again.');
  }
};
```

#### Error Boundaries
- Implement React Error Boundaries for component-level error handling
- Provide fallback UI for critical errors
- Log errors to monitoring service in production

### Testing Guidelines

#### Unit Tests
- Test pure functions and utilities thoroughly
- Mock external dependencies (API calls, WebSocket)
- Use descriptive test names with `describe` and `it`

```typescript
describe('calculateScore', () => {
  it('should calculate correct score for number cards', () => {
    expect(calculateScore({ color: 'red', value: 5 })).toBe(5);
  });

  it('should calculate correct score for action cards', () => {
    expect(calculateScore({ color: 'blue', value: 'draw-two' })).toBe(20);
  });
});
```

#### Component Tests
- Test user interactions and state changes
- Use testing-library/react for DOM testing
- Mock custom hooks and context providers

```typescript
test('plays card when clicked', () => {
  const mockOnPlay = jest.fn();
  render(<PlayerCard card={testCard} onPlay={mockOnPlay} />);

  fireEvent.click(screen.getByRole('button'));
  expect(mockOnPlay).toHaveBeenCalledWith(testCard);
});
```

#### Integration Tests
- Test complete user flows
- Use Playwright or Cypress for E2E testing
- Cover critical game scenarios (joining game, playing cards, winning)

### Performance Considerations

#### React Optimization
- Use `React.memo` for expensive components
- Implement proper dependency arrays in `useEffect` and `useCallback`
- Avoid unnecessary re-renders with proper state management

#### Game-Specific Optimizations
- Debounce rapid user interactions (card selection)
- Use Web Workers for heavy game logic if needed
- Implement proper cleanup for WebSocket connections
- Lazy load non-critical components

### Security Guidelines

#### Input Validation
- Validate all user inputs on client and server
- Sanitize data before rendering
- Use parameterized queries for database operations (if applicable)

#### WebSocket Security
- Validate incoming WebSocket messages
- Rate limit game actions to prevent abuse
- Implement proper authentication for game sessions

### Commit Guidelines

#### Commit Messages
- Use imperative mood: "Add feature" not "Added feature"
- Start with capitalized verb
- Keep first line under 50 characters
- Add detailed description for complex changes

#### Commit Types
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding/modifying tests
- `chore:` Maintenance tasks

## Implementation Notes

### Architecture Decisions
- Guidelines are enforced through ESLint and Prettier
- Pre-commit hooks ensure compliance
- Code reviews verify adherence to standards

### Design Patterns
- Functional components with hooks
- Custom hooks for logic extraction
- Context API for state management

### Code Organization
- Follow the specified file structure
- Use proper import ordering
- Maintain clean separation of concerns

### Testing Strategy
- Unit tests for utilities and pure functions
- Component tests for UI interactions
- Integration tests for complete flows

## Acceptance Criteria

### Compliance Checks
- [ ] All new code passes linting
- [ ] Code formatting follows Prettier rules
- [ ] TypeScript compilation succeeds without errors
- [ ] Tests cover required scenarios

### Review Process
- [ ] Pull requests include code style compliance
- [ ] Reviews check for guideline adherence

## References

- [AGENTS.md](AGENTS.md) - Main agent guidelines document
- [ESLint Configuration](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

*Spec Version: 1.0 | Status: Approved | Extraction from AGENTS.md*