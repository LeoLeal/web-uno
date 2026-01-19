# Game State and Types Specification

## Overview

**Title**: Game State and Types

**Type**: Type

**Status**: Draft

**Priority**: High

**Estimated Effort**: Medium

**Date Created**: 2026-01-19

**Last Updated**: 2026-01-19

### Description
Define the core TypeScript types and interfaces for the Uno game state, including card definitions, player states, game phases, and multiplayer synchronization structures.

### Goals
- Establish type safety for all game components
- Define clear interfaces for state synchronization
- Support both local and P2P multiplayer modes
- Enable proper game rule validation

### Dependencies
- P2P Multiplayer System (specs/_archive/p2p-multiplayer-system-approved.md)

## Requirements

### Functional Requirements
- [FR-001] Define card types with all Uno card variants
- [FR-002] Define player state including hand, score, and status
- [FR-003] Define complete game state for all game phases
- [FR-004] Define game actions and events for multiplayer sync
- [FR-005] Define validation rules for game state transitions

### Non-Functional Requirements
- [NFR-001] Types must support TypeScript strict mode
- [NFR-002] Types must be serializable for P2P transmission
- [NFR-003] Types must be immutable where possible for state safety

## Technical Specification

### Core Types

```typescript
// Card definitions
export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild'
export type CardValue =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'draw-two'
  | 'wild' | 'wild-draw-four'

export interface Card {
  id: string
  color: CardColor
  value: CardValue
  points: number // For scoring: numbers = face value, action cards = 20, wilds = 50
}

// Player state
export interface Player {
  id: string
  name: string
  hand: Card[]
  score: number
  isUno: boolean // Has called Uno
  isActive: boolean // Currently playing
  hasSkipped: boolean // For skip card effects
  cardsToDraw: number // For draw penalties
}

// Game phases
export type GamePhase =
  | 'waiting'      // Waiting for players to join
  | 'dealing'      // Dealing initial cards
  | 'playing'      // Active gameplay
  | 'round-end'    // Round finished, scoring
  | 'game-end'     // Game finished, final scores

// Game direction
export type GameDirection = 'clockwise' | 'counter-clockwise'

// Complete game state
export interface UnoGameState {
  // Game metadata
  id: string
  phase: GamePhase
  createdAt: Date
  startedAt?: Date
  endedAt?: Date

  // Players
  players: Player[]
  currentPlayerIndex: number
  direction: GameDirection
  hostPlayerId: string

  // Card state
  deck: Card[]
  discardPile: Card[]
  currentCard: Card | null

  // Game rules and settings
  maxPlayers: number
  pointsToWin: number
  allowStacking: boolean // Allow stacking +2/+4 cards
  forcePlay: boolean // Must play if possible

  // Round state
  roundNumber: number
  winner?: Player
  roundScores: Record<string, number> // playerId -> points earned this round

  // Multiplayer sync
  lastAction?: GameAction
  actionTimestamp?: Date
}
```

### Game Actions

```typescript
// All possible game actions
export type GameActionType =
  | 'JOIN_GAME'
  | 'LEAVE_GAME'
  | 'START_GAME'
  | 'PLAY_CARD'
  | 'DRAW_CARD'
  | 'CALL_UNO'
  | 'CHALLENGE_UNO'
  | 'SKIP_TURN'
  | 'REVERSE_DIRECTION'
  | 'DRAW_PENALTY'
  | 'NEXT_TURN'
  | 'END_ROUND'
  | 'END_GAME'

export interface GameAction {
  id: string
  type: GameActionType
  playerId: string
  timestamp: Date
  payload?: any // Action-specific data
}

// Specific action payloads
export interface PlayCardPayload {
  card: Card
  declaredColor?: CardColor // For wild cards
}

export interface DrawCardPayload {
  count: number
  reason: 'normal' | 'penalty' | 'no-playable-cards'
}

export interface ChallengeUnoPayload {
  challengerId: string
  targetId: string
  success: boolean // Whether challenge was correct
}
```

### Validation Types

```typescript
// Validation results
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Game rules validation
export interface CardPlayValidation extends ValidationResult {
  canPlay: boolean
  reason?: string
  alternativeActions?: GameAction[]
}

// State transition validation
export interface StateTransitionValidation extends ValidationResult {
  canTransition: boolean
  requiredActions?: GameAction[]
}
```

### P2P Synchronization Types

```typescript
// For Yjs CRDT synchronization
export interface YGameState {
  players: Y.Map<Player>
  currentPlayerIndex: Y.Text
  direction: Y.Text
  deck: Y.Array<Card>
  discardPile: Y.Array<Card>
  phase: Y.Text
  lastAction: Y.Map<GameAction>
}

// P2P connection types
export interface P2PGameState {
  localState: UnoGameState
  syncedState: UnoGameState
  pendingActions: GameAction[]
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected'
  lastSyncTimestamp: Date
}
```

### Utility Types

```typescript
// Type guards
export const isActionCard = (card: Card): boolean =>
  ['skip', 'reverse', 'draw-two', 'wild', 'wild-draw-four'].includes(card.value)

export const isWildCard = (card: Card): boolean =>
  card.color === 'wild'

export const isNumberCard = (card: Card): boolean =>
  !isNaN(Number(card.value))

// Computed types
export type ActivePlayers = Player[]
export type GameWinner = Player | null
export type CurrentPlayer = Player | null

// Event types for UI updates
export type GameEvent =
  | { type: 'PLAYER_JOINED'; player: Player }
  | { type: 'PLAYER_LEFT'; playerId: string }
  | { type: 'CARD_PLAYED'; action: GameAction }
  | { type: 'TURN_CHANGED'; player: Player }
  | { type: 'ROUND_ENDED'; winner: Player; scores: Record<string, number> }
  | { type: 'GAME_ENDED'; winner: Player; finalScores: Record<string, number> }
```

## Implementation Notes

### Type Safety
- All game state must be immutable to prevent accidental mutations
- Use readonly arrays and objects where possible
- Validate state transitions to prevent invalid game states

### Serialization
- All types must be JSON serializable for P2P transmission
- Dates should be serialized as ISO strings
- Complex objects should have toJSON methods

### Performance
- Keep state updates minimal and focused
- Use efficient data structures for large card arrays
- Implement proper memoization for computed values

## Acceptance Criteria

### Type Validation
- [ ] All interfaces compile without TypeScript errors
- [ ] Types prevent invalid game states at compile time
- [ ] All game actions are properly typed
- [ ] P2P synchronization types work with Yjs

### Runtime Safety
- [ ] State validation prevents invalid transitions
- [ ] Card play validation works correctly
- [ ] Type guards work for all card types
- [ ] Serialization/deserialization preserves data integrity

## References

- [Uno Official Rules](https://en.wikipedia.org/wiki/Uno_(card_game))
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Yjs Documentation](https://yjs.dev/docs/api/shared-types/)
- [P2P Multiplayer Spec](specs/_archive/p2p-multiplayer-system-approved.md)

---

*Spec Version: 1.0 | Status: Draft | Needs Review*