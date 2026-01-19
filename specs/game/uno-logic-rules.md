# Uno Game Logic and Rules Specification

## Overview

**Title**: Uno Game Logic and Rules

**Type**: Feature

**Status**: Draft

**Priority**: High

**Estimated Effort**: Large

**Date Created**: 2024-01-XX

**Last Updated**: 2024-01-XX

### Description
Implement the core Uno game logic, rules, and turn management system. This includes card playing validation, scoring, special card effects, and win conditions.

### Goals
- Implement accurate Uno game rules
- Handle all card types and special effects
- Provide turn management and player rotation
- Calculate scoring correctly
- Support configurable game rules

### Dependencies
- Game State and Types (specs/types/game-state-types.md)
- P2P Multiplayer System (specs/_archive/p2p-multiplayer-system-approved.md)

## Requirements

### Functional Requirements
- [FR-001] Deal 7 cards to each player at game start
- [FR-002] Validate card plays according to Uno rules
- [FR-003] Handle all special card effects (Skip, Reverse, Draw 2, Wild, Wild Draw 4)
- [FR-004] Implement turn rotation and direction changes
- [FR-005] Calculate round and game scores correctly
- [FR-006] Detect Uno calls and handle challenges
- [FR-007] Support configurable rule variants
- [FR-008] Handle edge cases (empty deck, no playable cards)

### Non-Functional Requirements
- [NFR-001] Game logic must be deterministic and fair
- [NFR-002] Rule validation must be fast (<10ms)
- [NFR-003] Logic must work identically across all P2P peers
- [NFR-004] Support for rule variants must be extensible

## Technical Specification

### Core Game Logic

```typescript
export class UnoGameLogic {
  constructor(gameState: UnoGameState, config?: GameConfig) {
    // Initialize game logic with state and configuration
  }

  // Core game actions
  canPlayCard(playerId: string, card: Card): CardPlayValidation
  playCard(playerId: string, card: Card, declaredColor?: CardColor): GameAction[]
  drawCard(playerId: string, count?: number): GameAction[]
  callUno(playerId: string): GameAction[]
  challengeUno(challengerId: string, targetId: string): GameAction[]

  // Turn management
  getCurrentPlayer(): Player | null
  advanceTurn(): GameAction[]
  skipTurn(playerId: string): GameAction[]
  reverseDirection(): GameAction[]

  // Game state management
  startGame(): GameAction[]
  endRound(): GameAction[]
  endGame(): GameAction[]

  // Scoring
  calculateRoundScore(winnerId: string): Record<string, number>
  getGameWinner(): Player | null

  // Validation
  validateGameState(): ValidationResult
  validateAction(action: GameAction): ValidationResult
}
```

### Card Playing Rules

```typescript
export class CardValidator {
  // Basic matching rules
  static canPlayOn(card: Card, targetCard: Card): boolean {
    // Same color or same value, or wild cards
  }

  // Special card effects
  static getCardEffect(card: Card): CardEffect | null {
    // Return effect for action cards
  }

  static applyCardEffect(
    effect: CardEffect,
    gameState: UnoGameState,
    playerId: string
  ): GameAction[]
}
```

### Special Card Effects

```typescript
export type CardEffectType =
  | 'SKIP_NEXT_PLAYER'
  | 'REVERSE_DIRECTION'
  | 'DRAW_TWO'
  | 'DRAW_FOUR'
  | 'WILD_COLOR_CHANGE'
  | 'CHALLENGE_UNO'

export interface CardEffect {
  type: CardEffectType
  targetPlayers?: string[]
  drawCount?: number
  newColor?: CardColor
}

// Effect implementations
export const CARD_EFFECTS: Record<CardValue, CardEffect> = {
  'skip': { type: 'SKIP_NEXT_PLAYER' },
  'reverse': { type: 'REVERSE_DIRECTION' },
  'draw-two': { type: 'DRAW_TWO', drawCount: 2 },
  'wild': { type: 'WILD_COLOR_CHANGE' },
  'wild-draw-four': { type: 'DRAW_FOUR', drawCount: 4 }
}
```

### Turn Management

```typescript
export class TurnManager {
  constructor(players: Player[], direction: GameDirection) {}

  getCurrentPlayer(): Player
  getNextPlayer(): Player
  getPreviousPlayer(): Player

  advanceTurn(): Player
  skipTurn(): Player
  reverseDirection(): GameDirection

  // Special turn logic
  handleSkipEffect(): Player
  handleReverseEffect(): Player
  handleDrawPenalty(targetPlayerId: string, drawCount: number): void
}
```

### Scoring System

```typescript
export class ScoringSystem {
  // Card point values
  static getCardPoints(card: Card): number {
    if (isNumberCard(card)) return Number(card.value)
    if (isActionCard(card)) return 20
    if (isWildCard(card)) return 50
    return 0
  }

  // Round scoring (points from other players' hands)
  static calculateRoundScore(
    players: Player[],
    winnerId: string
  ): Record<string, number> {
    const scores: Record<string, number> = {}
    const winner = players.find(p => p.id === winnerId)!

    players.forEach(player => {
      if (player.id !== winnerId) {
        const handPoints = player.hand.reduce(
          (sum, card) => sum + this.getCardPoints(card),
          0
        )
        scores[winnerId] = (scores[winnerId] || 0) + handPoints
      }
    })

    return scores
  }

  // Game win condition
  static getGameWinner(players: Player[], pointsToWin: number): Player | null {
    return players.find(p => p.score >= pointsToWin) || null
  }
}
```

### Uno Call System

```typescript
export class UnoManager {
  // Uno calling
  static canCallUno(player: Player): boolean {
    return player.hand.length === 2 && !player.isUno
  }

  static callUno(playerId: string, gameState: UnoGameState): GameAction[]

  // Challenge system
  static canChallengeUno(challenger: Player, target: Player): boolean {
    return target.hand.length === 1 && !target.isUno
  }

  static challengeUno(
    challengerId: string,
    targetId: string,
    gameState: UnoGameState
  ): ChallengeResult
}

export interface ChallengeResult {
  success: boolean
  penaltyCards: number // 2 cards if challenge succeeds
  actions: GameAction[]
}
```

### Configurable Rules

```typescript
export interface GameConfig {
  // Core rules
  maxPlayers: number
  pointsToWin: number
  initialCards: number

  // Rule variants
  allowStacking: boolean // Allow stacking +2/+4 cards
  forcePlay: boolean // Must play if possible, otherwise draw
  allowWildDrawFourOnAny: boolean // Can play WD4 on any card
  allowMultipleSkips: boolean // Skip affects multiple players
  zeroResetsScore: boolean // Playing 0 resets round score

  // Special rules
  jumpIn: boolean // Allow jumping in with matching cards
  sevenZero: boolean // 7 = swap hands, 0 = pass all cards
  progressiveDraw: boolean // Draw penalties stack
}
```

## Implementation Notes

### Game Flow
1. **Setup Phase**: Deal cards, set initial direction, place first card
2. **Play Phase**: Players take turns playing cards or drawing
3. **Action Resolution**: Apply card effects (skip, reverse, draw penalties)
4. **Uno Calling**: Players must call Uno when they have 1 card
5. **Round End**: First player to empty hand wins the round
6. **Scoring**: Calculate points from remaining cards
7. **Game End**: First player to reach target score wins

### Edge Cases
- **Empty Deck**: Shuffle discard pile (except top card) when deck runs out
- **No Playable Cards**: Force draw if no valid plays available
- **Multiple Effects**: Resolve effects in correct order (e.g., reverse + skip)
- **Challenge Timing**: Can challenge Uno calls within certain time limits
- **Disconnect Handling**: Handle player disconnections during turns

### Performance Considerations
- Card validation should be O(1) for most operations
- State updates should be batched for P2P synchronization
- Avoid deep object cloning on every state change
- Cache computed values like current player and valid moves

## Acceptance Criteria

### Rule Compliance
- [ ] All official Uno rules implemented correctly
- [ ] Special card effects work as expected
- [ ] Scoring calculations are accurate
- [ ] Turn management handles all edge cases

### Game Flow
- [ ] Complete game can be played from start to finish
- [ ] All player actions are validated properly
- [ ] Win conditions are detected correctly
- [ ] Round transitions work smoothly

### Multiplayer Support
- [ ] Game logic works identically across P2P peers
- [ ] State synchronization doesn't break game rules
- [ ] Disconnections handled without game corruption

## References

- [Official Uno Rules](https://www.unorules.com/)
- [Uno Wikipedia](https://en.wikipedia.org/wiki/Uno_(card_game))
- [Game State Types](specs/types/game-state-types.md)
- [P2P Multiplayer Spec](specs/_archive/p2p-multiplayer-system-approved.md)

---

*Spec Version: 1.0 | Status: Draft | Needs Implementation*