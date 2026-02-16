# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Summary

P2P Uno is a serverless, peer-to-peer multiplayer Uno card game built with React 19 (SPA via Vite), TypeScript (strict mode), Tailwind CSS v4, and Yjs CRDTs synced over WebRTC.

## Commands

| Task | Command |
|------|---------|
| Dev server (SPA + signaling) | `npm run dev` |
| SPA only | `npm run dev:web` |
| Signaling server only | `npm run dev:signaling` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Type check | `tsc --noEmit` |
| All tests | `npm run test` |
| Watch mode | `npm run test:watch` |
| Single test file | `npx vitest run path/to/file.test.tsx` |
| Single test by name | `npx vitest run -t "test name pattern"` |
| Coverage | `npm run test:coverage` |

## Architecture

### Host-Authoritative P2P Model

The game uses a "Trusted Dealer" architecture. One player is the **host** who manages the deck in memory (never shared via Yjs for security). All peers sync game state through Yjs CRDTs over WebRTC data channels. A custom WebSocket signaling server (`scripts/signaling.ts` on port 4444) handles NAT traversal for peer discovery.

### State Management Layers

- **Yjs shared document** (`Y.Doc`): The source of truth for all game state synced across peers
  - `gameStateMap`: status, currentTurn, direction, discardPile, turnOrder, hostId, etc.
  - `dealtHandsMap`: per-player card arrays (each player reads only their own)
  - `gameSettingsMap`: configurable game rules
- **Yjs Awareness**: peer presence, player names, avatars, host status
- **React Context** (`GameProvider`): provides the Yjs doc instance to the component tree
- **Local React state**: UI-only concerns (form inputs, modal visibility)

All Yjs updates must be wrapped in `doc.transact()` for atomicity.

### Key Hooks

| Hook | Responsibility |
|------|---------------|
| `useRoom` | WebRTC provider setup, peer discovery, host claiming, player list |
| `useGameState` | Subscribe to `gameStateMap` changes, read/write game status |
| `useGameEngine` | Host-only: deck management, dealing, card distribution |
| `useGameSettings` | Game rule configuration backed by Yjs |
| `usePlayerHand` | Read dealt cards for current player from Yjs |

### Routing

- `/` — Homepage (create/join game)
- `/room/:id` — Game room (renders lobby or gameplay based on game status)

Production hosting must support SPA rewrite/fallback to `index.html` for deep links (for example `/room/:id`).

Host role is claimed via a `sessionStorage` flag set during room creation.

## Code Conventions

- **TypeScript**: `interface` for object shapes and props; `type` for unions/primitives. No enums — use `as const` arrays with derived types. Avoid `any`; use `unknown` and narrow. Explicit return types on exports.
- **React**: Arrow function components in a client-rendered SPA. Custom hooks for Yjs/game logic.
- **Styling**: Tailwind utility classes. Use `cn()` (clsx + tailwind-merge) for conditional classes. Avoid arbitrary values (`w-[35px]`) — extend the theme instead. CSS modules for component-scoped styles where needed.
- **Imports**: Absolute via `@/` alias (e.g., `@/components/ui/Modal`, `@/hooks/useRoom`).
- **Naming**: PascalCase for components, camelCase for hooks/utils, kebab-case for directories, UPPER_SNAKE_CASE for constants.
- **Git**: Conventional Commits (`feat(scope): description`). Branch format: `<type>/<short-description>`.

## Testing

Vitest with jsdom environment and React Testing Library. Tests live alongside source files (`*.test.ts` for logic, `*.test.tsx` for components). Accessibility testing uses vitest-axe. Mock WebRTC/network layers; test user-visible behavior and accessibility roles rather than implementation details.

## Environment

Single env var: `VITE_SIGNALING_URL` (required). Set in `.env.local`.

## OpenSpec

The `openspec/` directory contains structured specifications and versioned change proposals. `openspec/specs/` holds stable system specs; `openspec/changes/` holds in-progress and archived feature changes. Use the `/opsx:*` skills for spec management workflows.
