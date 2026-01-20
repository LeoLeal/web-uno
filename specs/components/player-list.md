# Player List Specification

## Overview

**Title**: Player List

**Type**: Component

**Status**: Draft

**Priority**: Medium

**Estimated Effort**: Small

**Date Created**: 2026-01-20

**Last Updated**: 2026-01-20

### Description
Define the React component for displaying a list of players in a game room, including their status and game-relevant information.

### Goals
- Show current players and their states
- Indicate current player and host
- Update in real-time with player changes
- Support different game phases

### Dependencies
- Game State Types (specs/types/game-state-types.md) - Player data structures
- Coding Standards (specs/coding-standards.md) - Implementation guidelines

## Requirements

### Functional Requirements
- [FR-001] Display list of all players in room
- [FR-002] Show player names and IDs
- [FR-003] Indicate current player with visual cue
- [FR-004] Show host player with special indicator
- [FR-005] Display player scores if in scoring phase
- [FR-006] Update list in real-time
- [FR-007] Handle empty player list

### Non-Functional Requirements
- [NFR-001] Compact and readable layout
- [NFR-002] Fast updates with many players
- [NFR-003] Responsive design
- [NFR-004] Accessibility with proper labels

### User Stories
- As a player, I want to see who's in the room so that I can coordinate
- As a player, I want to know whose turn it is so that I can follow the game
- As a host, I want clear indication of my role so that others know I'm in charge

## Technical Specification

### API Interface
```typescript
interface PlayerListProps {
  players: Player[]
  currentPlayerId: string
  gamePhase: GamePhase
  showScores?: boolean
}

const PlayerList: React.FC<PlayerListProps> = ({ players, ...props }) => {
  // List of players with status indicators
}
```

### Data Structures
```typescript
// From game state types
interface Player {
  id: string
  name: string
  score?: number
  isHost?: boolean
}

type GamePhase = 'waiting' | 'playing' | 'scoring' | 'finished'
```

### Component Structure
```typescript
const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId, gamePhase, showScores = false }) => {
  return (
    <div className="player-list">
      <h3>Players ({players.length})</h3>
      <ul>
        {players.map(player => (
          <li
            key={player.id}
            className={`player-item ${player.id === currentPlayerId ? 'current' : ''} ${player.isHost ? 'host' : ''}`}
          >
            <span className="player-name">{player.name}</span>
            {player.isHost && <span className="host-badge">Host</span>}
            {player.id === currentPlayerId && <span className="current-indicator">Current</span>}
            {showScores && player.score !== undefined && (
              <span className="player-score">{player.score}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### State Management
- Props-driven updates
- No local state

### Error Handling
- Handle missing player data
- Fallback for empty lists

## Implementation Notes

### Architecture Decisions
- List-based rendering for scalability
- CSS classes for status indicators
- Conditional rendering for optional features

### Design Patterns
- Map rendering for dynamic lists
- Utility classes for styling variants
- Props composition for flexibility

### Code Organization
- `src/components/player/PlayerList.tsx` - Main component
- `src/components/player/playerStyles.css` - Status styling

### Testing Strategy
- Unit tests for conditional rendering
- Snapshot tests for different states
- Integration tests with mock player data

## Acceptance Criteria

### Visual Design
- [ ] Player names clearly displayed
- [ ] Host and current player indicators visible
- [ ] Scores show when enabled
- [ ] Compact layout for space efficiency

### Functionality
- [ ] List updates with player changes
- [ ] Correct status indicators
- [ ] Handles empty and full lists
- [ ] Responsive to game phase changes

### Performance
- [ ] Fast rendering with many players
- [ ] Efficient updates
- [ ] No memory leaks

### Accessibility
- [ ] Screen reader support
- [ ] Keyboard navigation if interactive
- [ ] High contrast indicators

## References

- [Game State Types](specs/types/game-state-types.md)
- [Game Room Spec](specs/features/game-room.md)
- [List Component Patterns](https://react.dev/learn/render-and-commit)

---

*Spec Version: 1.0 | Status: Draft | Ready for Implementation*</content>
<parameter name="filePath">specs/components/player-list.md