# Games Listing Specification

## Overview

**Title**: Games Listing

**Type**: Component

**Status**: Draft

**Priority**: Medium

**Estimated Effort**: Medium

**Date Created**: 2026-01-20

**Last Updated**: 2026-01-20

### Description
Define the React component for games listing and room management in the lobby, allowing users to view available games, enter room IDs, or create new rooms.

### Goals
- Provide simple room discovery and creation
- Enable seamless room transitions
- Support error handling for invalid rooms
- Integrate with P2P connection management

### Dependencies
- Game State Types (specs/types/game-state-types.md) - Room and player structures
- P2P Multiplayer System (specs/_archive/p2p-multiplayer-system-approved.md) - Room management
- Coding Standards (specs/coding-standards.md) - Implementation guidelines

## Requirements

### Functional Requirements
- [FR-001] Display room creation form with player name
- [FR-002] Provide room joining form with room ID and player name
- [FR-003] Validate input fields (name length, room ID format)
- [FR-004] Show connection status during room operations
- [FR-005] Handle room creation success/failure
- [FR-006] Navigate to room on successful join/create
- [FR-007] Display error messages for invalid operations

### Non-Functional Requirements
- [NFR-001] Fast room creation/joining (<2 seconds)
- [NFR-002] Secure input validation
- [NFR-003] Responsive form layout
- [NFR-004] Accessibility with form labels and errors

### User Stories
- As a user, I want to create a new room easily so that I can invite friends
- As a user, I want to join existing rooms by ID so that I can play with others
- As a user, I want clear feedback on connection issues so that I can troubleshoot

## Technical Specification

### API Interface
```typescript
interface GamesListingProps {
  room: GameRoom | null
  player: Player | null
  onCreateRoom: (playerName: string) => Promise<string>
  onJoinRoom: (roomId: string, playerName: string) => Promise<void>
  onLeaveRoom: () => void
  connectionState: ConnectionState
}

const GamesListing: React.FC<GamesListingProps> = ({ room, ...props }) => {
  // Games listing and room creation/joining interface
}
```

### Data Structures
```typescript
// From game state types
interface GameRoom {
  id: string
  players: Player[]
  maxPlayers: number
  createdAt: Date
}

interface Player {
  id: string
  name: string
}

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'
```

### Component Structure
```typescript
const GamesListing: React.FC<GamesListingProps> = ({ room, player, onCreateRoom, onJoinRoom, onLeaveRoom, connectionState }) => {
  const [formData, setFormData] = useState({ playerName: '', roomId: '' })
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const roomId = await onCreateRoom(formData.playerName)
      // Navigate to room
    } catch (error) {
      // Handle error
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoin = async () => {
    setIsJoining(true)
    try {
      await onJoinRoom(formData.roomId, formData.playerName)
      // Navigate to room
    } catch (error) {
      // Handle error
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="game-room">
      <ConnectionStatus state={connectionState} />
      <RoomForm
        formData={formData}
        onChange={setFormData}
        onCreate={handleCreate}
        onJoin={handleJoin}
        isCreating={isCreating}
        isJoining={isJoining}
      />
    </div>
  )
}
```

### State Management
- Local form state for input handling
- Async state for loading indicators
- Props for room and connection data

### Error Handling
- Client-side validation with user feedback
- Server error handling with retry options
- Connection state monitoring

## Implementation Notes

### Architecture Decisions
- Form state management with controlled components
- Async action handling with loading states
- Error boundary integration

### Design Patterns
- Container component for business logic
- Presentational components for UI
- Custom hooks for form validation

### Code Organization
- `src/components/room/GameRoom.tsx` - Main component
- `src/components/room/RoomForm.tsx` - Form UI
- `src/hooks/useRoomConnection.ts` - Connection logic

### Testing Strategy
- Unit tests for form validation
- Integration tests for room operations
- E2E tests for full create/join flow

## Acceptance Criteria

### Functional Tests
- [ ] Form inputs accept valid data
- [ ] Create room generates new room ID
- [ ] Join room validates and enters existing room
- [ ] Error messages for invalid inputs/rooms
- [ ] Connection status updates correctly

### User Experience
- [ ] Loading states during operations
- [ ] Clear success/error feedback
- [ ] Responsive form layout
- [ ] Keyboard navigation support

### Security
- [ ] Input sanitization
- [ ] Room ID validation
- [ ] No sensitive data exposure

### Performance
- [ ] Fast form interactions
- [ ] Efficient re-renders
- [ ] Memory cleanup on unmount

## References

- [Game State Types](specs/types/game-state-types.md)
- [P2P Multiplayer System](specs/_archive/p2p-multiplayer-system-approved.md)
- [Lobby Spec](specs/features/lobby.md)
- [Form Validation Patterns](https://react-hook-form.com/)

---

*Spec Version: 1.0 | Status: Draft | Ready for Implementation*</content>
<parameter name="filePath">specs/components/game-room-component.md