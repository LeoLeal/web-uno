# Lobby Specification

## Overview

**Title**: Lobby

**Type**: Feature

**Status**: Draft

**Priority**: High

**Estimated Effort**: Medium

**Date Created**: 2026-01-20

**Last Updated**: 2026-01-20

### Description
The lobby serves as the homepage and entry point for the Web Uno multiplayer application. It welcomes users, allows them to enter or retrieve their name, view a list of available rooms, enter a room ID to join an existing room, or create a new room with a user-provided ID. After successful join or creation, users navigate directly to the game room, a waiting area displaying the game board where they can wait for other players to join before starting the game.

### Goals
- Provide an intuitive and welcoming entry point for all users
- Enable easy room discovery and joining
- Support user name persistence for returning players
- Ensure secure input validation and error handling
- Facilitate smooth navigation to the game experience

### Dependencies
- None (This is the initial entry feature)
- Future dependencies: P2P Multiplayer System (specs/features/p2p-multiplayer-system.md) for room listing and management
- Form validation utilities (to be specified) for input handling
- Game Room (separate spec to be created) for the waiting area and game board display

## Requirements

### Functional Requirements
- [FR-001] Display a welcoming homepage with Uno branding and instructions
- [FR-002] Provide a name input field with persistence via localStorage
- [FR-003] Display a list of available rooms for users to join
- [FR-004] Provide a room ID input field for joining specific rooms
- [FR-005] Include a "Join Room" button that validates inputs and navigates to game room
- [FR-006] Include a "Create Room" button that validates inputs and creates a new room
- [FR-007] Implement input validation: name (2-20 characters, alphanumeric + spaces), room ID (4-10 alphanumeric characters)
- [FR-008] Show clear error messages for validation failures and room not found scenarios
- [FR-009] Auto-refresh room list periodically to show current available rooms
- [FR-010] Navigate to game room upon successful join or creation

### Non-Functional Requirements
- [NFR-001] Page load time < 2 seconds
- [NFR-002] Responsive design supporting mobile and desktop
- [NFR-003] Accessibility compliant (WCAG 2.1 AA) with keyboard navigation
- [NFR-004] Secure input handling to prevent XSS and injection attacks
- [NFR-005] Smooth animations and transitions for better UX

### User Stories
- As a new player, I want to enter my name and see available rooms so that I can easily join a game
- As a returning player, I want my name to be remembered so that I don't have to enter it again
- As a player, I want to create a room with my own ID so that I can share it with friends
- As a player, I want clear error messages if my room doesn't exist or inputs are invalid so that I can correct them
- As a mobile user, I want the lobby to work well on my phone so that I can play anywhere

## Technical Specification

### API Interface
```typescript
// Main lobby component props
interface GameLobbyProps {
  onNavigateToRoom: (roomId: string, playerName: string) => void  // Navigates to game room (waiting area)
  onError: (error: LobbyError) => void
}

// Form data structure
interface LobbyFormData {
  playerName: string
  roomId: string
}

// Room information for listing
interface RoomInfo {
  id: string
  name: string
  playerCount: number
  maxPlayers: number
  isPrivate: boolean
  createdAt: Date
}

// Error types
type LobbyError =
  | { type: 'validation'; field: 'name' | 'roomId'; message: string }
  | { type: 'room_not_found'; roomId: string }
  | { type: 'room_full'; roomId: string }
  | { type: 'network_error'; message: string }
```

### Data Structures
```typescript
// Persisted user data
interface PersistedUser {
  name: string
  lastLogin: Date
}

// Room listing response (placeholder for future P2P integration)
interface RoomListResponse {
  rooms: RoomInfo[]
  lastUpdated: Date
}
```

### Component Structure
```typescript
// Main Lobby Component
const GameLobby: React.FC<GameLobbyProps> = ({ onNavigateToRoom, onError }) => {
  // Component implementation with form state, validation, and room listing
}

// Form validation hook
const useLobbyValidation = (formData: LobbyFormData) => {
  // Validation logic for name and room ID
  return {
    isValid: boolean,
    errors: Record<string, string>
  }
}

// Room list component
interface RoomListProps {
  rooms: RoomInfo[]
  onRoomSelect: (roomId: string) => void
  loading: boolean
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onRoomSelect, loading }) => {
  // Display available rooms with join buttons
}
```

### State Management
- Local component state for form inputs and validation errors
- localStorage for user name persistence
- Future: P2P state for real-time room listing

### Error Handling
- Client-side validation with immediate feedback
- Async error handling for room operations
- User-friendly error messages with actionable guidance
- Graceful degradation for network failures

## Implementation Notes

### Architecture Decisions
- Page-level component using Next.js App Router
- Client-side form validation with custom hooks
- localStorage for simple persistence (no server required)
- Placeholder room listing (static/mock initially, P2P integration later)

### Design Patterns
- Custom hooks for validation and persistence
- Compound component pattern for form sections
- Error boundary for lobby-specific errors

### Code Organization
- `src/app/page.tsx` - Main lobby page component
- `src/components/lobby/` - Lobby-specific components (RoomList, LobbyForm)
- `src/hooks/useLobbyValidation.ts` - Validation logic
- `src/utils/lobbyStorage.ts` - localStorage utilities
- `src/types/lobby.ts` - TypeScript interfaces

### Testing Strategy
- Unit tests for validation logic and storage utilities
- Integration tests for form submission and navigation
- E2E tests for complete join/create flows
- Accessibility tests for screen reader support

## Acceptance Criteria

### Functional Tests
- [ ] Welcome message and branding display correctly
- [ ] Name input persists across sessions
- [ ] Room list shows available rooms with player counts
- [ ] Room ID input accepts valid formats
- [ ] Join button validates and navigates for existing rooms
- [ ] Create button validates and creates rooms with user ID
- [ ] Error messages appear for invalid inputs
- [ ] Room not found shows appropriate error
- [ ] Navigation to game room works after success

### Edge Cases
- [ ] Empty or whitespace-only inputs are rejected
- [ ] Room IDs with special characters are rejected
- [ ] Names longer than 20 characters are truncated or rejected
- [ ] Room list handles empty state gracefully
- [ ] Network errors during room operations are handled
- [ ] localStorage unavailable (private browsing) falls back gracefully

### Performance Criteria
- [ ] Initial page load < 2 seconds
- [ ] Room list updates without blocking UI
- [ ] Form validation is instantaneous
- [ ] Memory usage remains low with large room lists

### Security Requirements
- [ ] Input sanitization prevents XSS attacks
- [ ] No sensitive data stored in localStorage
- [ ] Room IDs are validated server-side (future)
- [ ] Rate limiting for room creation (future)

## Diagrams

```mermaid
graph TD
    A[User Visits Homepage] --> B[Display Welcome & Form]
    B --> C[Load Persisted Name]
    B --> D[Fetch Room List]
    C --> E[User Inputs/Selects Room]
    D --> E
    E --> F{Validate Inputs}
    F -->|Valid| G[Join/Create Room]
    F -->|Invalid| H[Show Errors]
    G --> I[Navigate to Game Room (Waiting Area)]
    H --> E
```

## References

- [UI Components Spec](specs/components/ui-components.md)
- [P2P Multiplayer System](specs/features/p2p-multiplayer-system.md)
- [Coding Standards](specs/coding-standards.md)
- [Uno Game Rules](https://en.wikipedia.org/wiki/Uno_(card_game))
- [React Forms Best Practices](https://react.dev/reference/react-dom/components/form)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

---

*Spec Version: 1.0 | Status: Draft | Ready for Implementation*</content>
<parameter name="filePath">specs/features/game-lobby.md