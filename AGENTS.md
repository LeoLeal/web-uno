# AGENTS.md - Web Uno Multiplayer Game

This document provides guidelines for AI agents working on the Web Uno multiplayer game project.

## Project Overview
Web Uno is a multiplayer card game implementation built as a modern web application using **spec-driven development**. All features and components are thoroughly specified in the `specs/` directory before implementation. The project uses contemporary JavaScript/TypeScript tooling for development, testing, and deployment.

### Development Workflow
1. **Review Specs**: Check the `specs/` directory for existing specifications
2. **Create/Update Specs**: Use the spec template for new features or updates
3. **Implement**: Build according to approved specifications
4. **Test & Validate**: Ensure implementation meets all acceptance criteria
5. **Archive**: Move completed specs to `specs/_archive/`

### Key Resources
- **[📁 specs/](specs/)** - Feature and component specifications
- **[📝 Spec Template](specs/templates/spec-template.md)** - Template for creating specifications

## Build System & Commands

### Development Server
```bash
npm run dev        # Start development server with hot reload
npm run build      # Production build
npm run preview    # Preview production build locally
```

### Testing
```bash
npm test           # Run all tests
npm run test:unit  # Run unit tests only
npm run test:e2e   # Run end-to-end tests
npm run test:ci    # Run tests in CI mode (no watch)

# Run specific test file
npm test -- path/to/test.spec.ts

# Run tests for specific component/function
npm test -- --grep "GameLogic"
```

### Code Quality
```bash
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix ESLint issues
npm run typecheck  # TypeScript type checking
npm run format     # Format code with Prettier
```

### Additional Commands
```bash
npm run clean      # Clean build artifacts
npm run serve      # Serve built application
```

## Code Style Guidelines

### Language & Framework
- **Primary Language**: TypeScript (strict mode enabled)
- **Framework**: React with Vite for build tooling
- **State Management**: React hooks with Context API for global state
- **Styling**: CSS-in-JS with emotion/styled-components or Tailwind CSS

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
- Use PascalCase for component names: `GameBoard.tsx`, `PlayerHand.tsx`
- File names match component names: `GameBoard.tsx` exports `GameBoard`
- Hook files use camelCase with `use` prefix: `useGameState.ts`

#### Variables & Functions
- camelCase for variables and functions: `playerCards`, `calculateScore()`
- PascalCase for types and interfaces: `GameState`, `PlayerInfo`
- SCREAMING_SNAKE_CASE for constants: `MAX_PLAYERS`, `CARD_COLORS`

#### Files
- Component files: `PascalCase.tsx`
- Utility files: `camelCase.ts`
- Test files: `componentName.test.ts` or `componentName.spec.ts`

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
- Use `unknown` instead of `any` when type is uncertain
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

## Tooling Configuration

### ESLint Configuration
- Extends recommended rules for TypeScript and React
- Custom rules for game-specific patterns
- Pre-commit hooks enforce code quality

### Prettier Configuration
- Consistent formatting across the codebase
- Integrated with ESLint for seamless development experience

### TypeScript Configuration
- Strict mode enabled
- Path mapping for clean imports
- Declaration files generated for library usage

## Deployment

### Build Process
1. Run type checking: `npm run typecheck`
2. Run linting: `npm run lint`
3. Run tests: `npm test`
4. Build production bundle: `npm run build`

### Environment Variables
- Use `.env` files for environment-specific configuration
- Never commit secrets to repository
- Use `VITE_` prefix for client-side environment variables

## Additional Resources

- [Uno Game Rules](https://en.wikipedia.org/wiki/Uno_(card_game))
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

*This document should be updated as the project evolves and new patterns emerge.*