# Agentic Coding Guidelines - P2P Uno

For product vision and architecture, see /project.md.

This document outlines the development standards, commands, and conventions for the **P2P Uno** project. Agents and developers should strictly adhere to these guidelines to maintain codebase consistency and quality.

## 1. Project Overview & Tech Stack

This is a peer-to-peer multiplayer Uno game.

- **Framework**: React SPA + Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **State**: React Context + Yjs (CRDT for P2P)
- **Networking**: WebRTC (y-webrtc for P2P state sync)
- **Testing**: Vitest + React Testing Library

## 2. Operational Commands

### Package Management

- Use `npm` for dependency management.
- Install dependencies: `npm install`
- Add dev dependency: `npm install -D <package>`

### Build & Run

- **Signaling Server**: `npm run signaling`
  - Required for P2P discovery in dev environment.
- **Development Server**: `npm run dev`
  - Runs on: `http://localhost:3000`
- **Web Only (SPA)**: `npm run dev:web`
- **Production Build**: `npm run build`
- **Start Production**: `npm run start`

### Linting & Formatting

- **Lint Code**: `npm run lint`
  - Strictly fix all ESLint warnings/errors before committing.
- **Type Check**: `tsc --noEmit`
  - Ensure zero type errors.

### Testing (Vitest)

- **Run All Tests**: `npm run test` (or `npm test`)
- **Run Tests in Watch Mode**: `npm run test:watch`
- **Run Single Test File**:
  ```bash
  npx vitest run path/to/file.test.tsx
  ```
- **Run Specific Test Case (by name)**:
  ```bash
  npx vitest run -t "should render the card correctly"
  ```
- **Coverage**: `npm run test:coverage`

## 3. Code Style Guidelines

### General Principles

- **Functional Programming**: Prefer pure functions and immutability.
- **Composition**: Favor component composition over inheritance or complex configuration.
- **DRY (Don't Repeat Yourself)**: Extract common logic into custom hooks or utility functions.
- **Early Returns**: Use early returns to reduce nesting in conditionals.

### TypeScript Conventions

- **Strict Typing**: Avoid `any`. Use `unknown` if the type is truly uncertain, then narrow it.
- **Interfaces**: Use `interface` for object definitions and React props (e.g., `interface ButtonProps`).
- **Types**: Use `type` for unions, intersections, or primitives (e.g., `type CardColor = 'red' | 'blue'`).
- **Explicit Returns**: Explicitly define return types for all exported functions and hooks.
  ```typescript
  export const calculateScore = (cards: Card[]): number => { ... }
  ```
- **Enums**: Avoid TypeScript Enums; use Union Types or const objects instead.
  ```typescript
  // DO
  const CARD_COLORS = ["red", "blue", "green", "yellow"] as const;
  type CardColor = (typeof CARD_COLORS)[number];
  ```

### React & SPA Conventions

- **Functional Components**: Use arrow functions for components.
  ```tsx
  export const GameBoard = ({ deckId }: GameBoardProps) => { ... }
  ```
- **Hooks**:
  - Place hooks at the top of the component.
  - Create custom hooks for complex logic (`useGameLogic`, `usePeerConnection`).
- **Props**:
  - Destructure props in the function signature.
  - Use default parameters instead of `defaultProps`.
- **Client Architecture**:
  - This project is a client-rendered SPA.
  - Keep state/effects in components/hooks as needed and avoid server-only assumptions.

### Styling (Tailwind CSS)

- **Utility First**: Use standard Tailwind utility classes.
- **No Arbitrary Values**: Avoid brackets like `w-[35px]` unless absolutely necessary. Add to `tailwind.config.ts` theme if reused.
- **Class Sorting**: Order classes logically (layout -> box model -> typography -> decoration -> effects).
  - Recommended: `flex items-center justify-center p-4 m-2 text-lg font-bold bg-blue-500 rounded-md hover:bg-blue-600`
- **Conditional Classes**: Use `clsx` or `cn` (shadcn-like utility) for conditional class application.
  ```tsx
  <div className={cn('p-4', isActive && 'bg-blue-100')}>
  ```

### File Structure & Naming

- **Directories**: kebab-case (e.g., `components/game-board`, `lib/utils`).
- **Component Files**: PascalCase (e.g., `Card.tsx`, `PlayerHand.tsx`).
- **Utility/Hook Files**: camelCase (e.g., `useGameState.ts`, `formatDate.ts`).
- **Routes**:
  - Use `react-router-dom` route mapping in the SPA runtime.
  - Preserve public URL compatibility for existing paths (`/`, `/room/:id`).
- **Imports**:
  - Use Absolute Imports configured in `tsconfig.json`.
  - Pattern: `@/components/...`, `@/lib/...`, `@/hooks/...`.
  ```typescript
  import { Card } from "@/components/ui/Card";
  import { useDeck } from "@/hooks/useDeck";
  ```

## 4. Error Handling

- **API/Network**: Wrap async calls in `try/catch` blocks. Return standardized error objects or Result types.
- **UI Boundaries**: Use React Error Boundaries to catch crashes in component sub-trees.
- **Validation**: Use Zod for schema validation (forms, API responses, P2P messages).
- **User Guidance**: Error messages must guide users on what to do next (e.g., "Connection lost. Please check your internet and refresh." instead of just "Error 500").

## 5. State Management & P2P

- **Local State**: Use `useState` for simple component UI state.
- **Global State**: Use React Context for theme or user settings.
- **Game State (P2P)**:
  - All game logic should operate on the Yjs shared document (CRDT).
  - **Do not** store game state solely in local React state; it must be synced.
  - Updates should be atomic transactions on the Yjs doc.
- **Hooks for State**: Encapsulate Yjs logic in hooks (e.g., `useSyncedMap`, `useSyncedArray`) to abstract the complexity from UI components.

## 6. Testing Strategy

- **Unit Tests**:
  - Focus on pure logic (game rules, score calculation).
  - File convention: `*.test.ts` alongside the source file.
- **Component Tests**:
  - Focus on interaction and rendering.
  - Use `screen` from `@testing-library/react`.
  - File convention: `*.test.tsx`.
  - Avoid testing implementation details; test accessibility roles and user-visible text.
- **Integration Tests**:
  - Test the flow between hooks and components.
  - Mock WebRTC/Network layers for reliable testing.

## 7. Documentation & Comments

- **Self-Documenting Code**: Variable and function names should explain their purpose.
- **JSDoc**: Use JSDoc for complex utility functions, explaining parameters and return values.
- **Code Comments**:
  - Explain _WHY_, not _WHAT_.
  - Use `// TODO:` for technical debt or missing features.

## 8. Git & Commit Guidelines

- **Commitzen / Conventional Commits**: Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- **Format**: `<type>(<scope>): <subject>`
- **Types**:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation
- **Example**: `feat(game-board): add initial card rendering logic`

### Branch Naming

- **Format**: `<type>/<short-description>`
- **Types**: Must match the commit types (feat, fix, refactor, etc.).
- **Description**: kebab-case, short and descriptive.
- **Examples**:
  - `feat/multiplayer-setup`
  - `fix/card-drag-issue`
  - `chore/update-deps`

### Pull Requests

- **Description**: State clearly _what_ changed and the _impact_ of those changes.
- **Skip the Journey**: Do not narrate the development process ("I tried X then Y"). Focus on the final result.

## 9. Agent Instructions

- **Before Coding**: Read existing code to match style. Run related tests to establish a baseline.
- **While Coding**: Implement small, atomic changes.
- **After Coding**:
  1. Run formatting/linting (`npm run lint`).
  2. Run tests (`npm run test`).
  3. Ensure no regression.
  4. Create new tests for new functionality.

---

_Generated by OpenCode for P2P Uno Project_
