# UI Components Overview

## Overview

**Title**: UI Components

**Type**: Component Collection

**Status**: Archived

**Priority**: N/A

**Estimated Effort**: N/A

**Date Created**: 2026-01-19

**Last Updated**: 2026-01-20

### Description
This specification has been broken down into separate component specifications for better organization and maintainability. See the individual component specs below for detailed implementation requirements.

### Goals
- Organize UI components into focused, manageable specifications
- Enable parallel development of different UI elements
- Improve spec discoverability and maintenance

### Dependencies
- Game State and Types (specs/types/game-state-types.md)
- Uno Game Logic and Rules (specs/game/uno-logic-rules.md)
- P2P Multiplayer System (specs/_archive/p2p-multiplayer-system-approved.md)

## Component Specifications

This overview has been divided into the following individual component specifications:

### Core Game Components
- [Card Components](card-components.md) - Uno card display and interaction
- [Game Board](game-board.md) - Main game area with discard pile and actions
- [Player Hand](player-hand.md) - Player's card hand management
- [Game Actions](game-actions.md) - Action buttons for gameplay

### Multiplayer Components
- [Game Room Component](game-room-component.md) - Room creation and joining interface
- [Connection Status](connection-status.md) - P2P connection indicators

### Information Display Components
- [Player List](player-list.md) - List of players with status
- [Score Board](score-board.md) - Game scoring and standings

## Requirements

### Functional Requirements
- [FR-001] Display Uno cards with proper colors and symbols
- [FR-002] Show player hands with playable card indicators
- [FR-003] Display game board with discard pile and current card
- [FR-004] Show player status and turn indicators
- [FR-005] Provide card selection and playing interface
- [FR-006] Display game scores and round information
- [FR-007] Show multiplayer connection status
- [FR-008] Support responsive design for mobile and desktop

### Non-Functional Requirements
- [NFR-001] Components must be performant with 50+ cards
- [NFR-002] Touch interactions must be smooth on mobile
- [NFR-003] Visual feedback must be immediate (<100ms)
- [NFR-004] Accessibility support (WCAG 2.1 AA)
- [NFR-005] Animations must not impact game performance

## Technical Specification

### Core Components

```typescript
// Card Components
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

// Game Board
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

// Player Hand
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

### Multiplayer Components

```typescript
// Room Management
interface GameRoomProps {
  room: GameRoom | null
  player: Player | null
  onCreateRoom: (playerName: string) => Promise<string>
  onJoinRoom: (roomId: string, playerName: string) => Promise<void>
  onLeaveRoom: () => void
  connectionState: ConnectionState
}

const GameRoom: React.FC<GameRoomProps> = ({ room, ...props }) => {
  // Room creation/joining interface
}

// Connection Status
interface ConnectionStatusProps {
  state: ConnectionState
  peers: PeerConnection[]
  quality: 'excellent' | 'good' | 'poor' | 'disconnected'
  onReconnect?: () => void
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ state, ...props }) => {
  // Connection indicator with peer list
}
```

### Game UI Components

```typescript
// Player List
interface PlayerListProps {
  players: Player[]
  currentPlayerId: string
  gamePhase: GamePhase
  showScores?: boolean
}

const PlayerList: React.FC<PlayerListProps> = ({ players, ...props }) => {
  // List of players with status indicators
}

// Score Board
interface ScoreBoardProps {
  players: Player[]
  currentRound: number
  pointsToWin: number
  roundScores?: Record<string, number>
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, ...props }) => {
  // Game scoring display
}

// Game Actions
interface GameActionsProps {
  canDraw: boolean
  canCallUno: boolean
  canPlay: boolean
  onDrawCard: () => void
  onCallUno: () => void
  onPassTurn: () => void
  disabled?: boolean
}

const GameActions: React.FC<GameActionsProps> = ({ ...props }) => {
  // Action buttons for game controls
}
```

### Styling and Theming

```typescript
// Uno color scheme
const UNO_COLORS = {
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#ca8a04',
  wild: '#7c3aed',
  black: '#1f2937',
} as const

// Card styling utilities
const getCardStyles = (card: Card, size: CardSize): React.CSSProperties => {
  // Dynamic styling based on card properties
}

const getCardSymbol = (value: CardValue): string => {
  // Convert card values to display symbols
}
```

### Animation and Interactions

```typescript
// Card animations
const CARD_ANIMATIONS = {
  draw: 'animate-slide-in-from-bottom',
  play: 'animate-slide-out-to-center',
  shuffle: 'animate-shuffle',
  highlight: 'animate-pulse-border',
} as const

// Interaction handlers
const useCardInteraction = (card: Card, onSelect: (card: Card) => void) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  // Touch and mouse event handlers
  const handleInteraction = useCallback(() => {
    onSelect(card)
    setIsSelected(true)
  }, [card, onSelect])

  return {
    isHovered,
    isSelected,
    interactionProps: {
      onClick: handleInteraction,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    }
  }
}
```

## Implementation Notes

### Component Architecture
- Use compound component pattern for complex UI sections
- Implement proper error boundaries for game components
- Use React.memo for expensive card rendering
- Separate presentational and container components

### Performance Optimizations
- Virtualize large card lists if needed
- Use CSS transforms for card animations
- Implement proper key props for dynamic lists
- Debounce rapid user interactions

### Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes
- Focus management for modals and dialogs

### Responsive Design
- Mobile-first approach
- Touch-friendly card sizes (minimum 44px touch targets)
- Flexible layouts for different screen sizes
- Landscape/portrait orientation support

### State Management
- Local component state for UI interactions
- Game state from P2P synchronization
- Separate UI state from game logic

## Acceptance Criteria

### Visual Design
- [ ] Cards display correct colors and symbols
- [ ] Game board layout is intuitive and clear
- [ ] Player hands are easy to interact with
- [ ] Visual feedback is immediate and clear

### Interactions
- [ ] Card selection and playing works smoothly
- [ ] Touch interactions are responsive on mobile
- [ ] Keyboard navigation is fully supported
- [ ] No accidental card plays or selections

### Performance
- [ ] UI remains responsive with full player hands
- [ ] Animations don't cause frame drops
- [ ] Memory usage stays reasonable during long games
- [ ] Initial load time <3 seconds

### Accessibility
- [ ] Screen reader support for all interactive elements
- [ ] Keyboard-only gameplay is possible
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible and clear

## References

- [Uno Card Designs](https://www.unorules.com/uno-cards/)
- [Material Design Guidelines](https://material.io/design)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)
- [Game State Types](specs/types/game-state-types.md)
- [Uno Logic Spec](specs/game/uno-logic-rules.md)

---

*Spec Version: 1.0 | Status: Draft | Ready for Design*