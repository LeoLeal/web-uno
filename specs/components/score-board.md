# Score Board Specification

## Overview

**Title**: Score Board

**Type**: Component

**Status**: Draft

**Priority**: Low

**Estimated Effort**: Small

**Date Created**: 2026-01-20

**Last Updated**: 2026-01-20

### Description
Define the React component for displaying game scores and round information in Uno games.

### Goals
- Show current standings clearly
- Track round-by-round progress
- Motivate players with score visibility
- Support different game formats

### Dependencies
- Game State Types (specs/types/game-state-types.md) - Score data structures
- Coding Standards (specs/coding-standards.md) - Implementation guidelines

## Requirements

### Functional Requirements
- [FR-001] Display current player scores
- [FR-002] Show round number and points to win
- [FR-003] Sort players by score ranking
- [FR-004] Highlight winner when game ends
- [FR-005] Update in real-time during scoring
- [FR-006] Handle tie situations

### Non-Functional Requirements
- [NFR-001] Clear and readable score display
- [NFR-002] Fast updates during scoring
- [NFR-003] Responsive table layout
- [NFR-004] Accessibility with score announcements

### User Stories
- As a player, I want to see my score and ranking so that I can track my progress
- As a player, I want to know how many points are needed to win so that I can strategize
- As a spectator, I want clear score information so that I can follow the game

## Technical Specification

### API Interface
```typescript
interface ScoreBoardProps {
  players: Player[]
  currentRound: number
  pointsToWin: number
  roundScores?: Record<string, number>
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, ...props }) => {
  // Game scoring display
}
```

### Data Structures
```typescript
// From game state types
interface Player {
  id: string
  name: string
  score: number
}
```

### Component Structure
```typescript
const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, currentRound, pointsToWin, roundScores }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  return (
    <div className="score-board">
      <h3>Score Board - Round {currentRound}</h3>
      <p>Points to Win: {pointsToWin}</p>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            {roundScores && <th>This Round</th>}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.id} className={index === 0 ? 'leader' : ''}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.score}</td>
              {roundScores && <td>{roundScores[player.id] || 0}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### State Management
- Props-driven score data
- No local state

### Error Handling
- Handle missing score data
- Fallback for tie rankings

## Implementation Notes

### Architecture Decisions
- Table-based layout for structured data
- Sorting logic in component for flexibility
- Optional round scores for detailed tracking

### Design Patterns
- Data transformation in render
- Conditional columns
- Ranking calculation

### Code Organization
- `src/components/score/ScoreBoard.tsx` - Main component
- `src/components/score/scoreStyles.css` - Table styling

### Testing Strategy
- Unit tests for sorting logic
- Visual tests for table layout
- Integration tests with score updates

## Acceptance Criteria

### Visual Design
- [ ] Clear table layout with headers
- [ ] Leader highlighting
- [ ] Round information prominently displayed
- [ ] Responsive table sizing

### Functionality
- [ ] Players sorted by score
- [ ] Round scores display when provided
- [ ] Updates with score changes
- [ ] Handles ties appropriately

### Performance
- [ ] Fast sorting with many players
- [ ] Efficient re-renders
- [ ] Memory efficient

### Accessibility
- [ ] Table navigation support
- [ ] Screen reader score announcements
- [ ] High contrast text

## References

- [Game State Types](specs/types/game-state-types.md)
- [Uno Scoring Rules](https://www.unorules.com/uno-scoring/)
- [Data Table Patterns](https://www.nngroup.com/articles/data-tables/)

---

*Spec Version: 1.0 | Status: Draft | Ready for Implementation*</content>
<parameter name="filePath">specs/components/score-board.md