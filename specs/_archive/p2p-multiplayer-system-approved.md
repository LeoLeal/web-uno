# P2P Multiplayer System Specification

## Overview

**Title**: P2P Multiplayer System

**Type**: Feature

**Status**: Approved

**Priority**: High

**Estimated Effort**: Large

**Date Created**: 2024-01-XX

**Last Updated**: 2024-01-XX

### Description
Implement peer-to-peer (P2P) multiplayer functionality for the Web Uno game using WebRTC technology. This allows players to connect directly without requiring a centralized game server, enabling cost-effective multiplayer gaming with low latency.

### Goals
- Enable direct peer-to-peer connections between players
- Provide room-based matchmaking via URL sharing
- Implement reliable game state synchronization
- Handle network disconnections gracefully
- Maintain game integrity and prevent cheating

### Dependencies
- WebRTC browser support (modern browsers)
- Signaling server for initial connection establishment
- Yjs for conflict-free replicated data types (CRDT)
- @jbatch/webrtc-client for React hooks integration

## Requirements

### Functional Requirements
- [FR-001] Players can create or join game rooms via shared URLs
- [FR-002] Direct P2P connections established between all players in a room
- [FR-003] Real-time synchronization of game state across all peers
- [FR-004] Turn-based gameplay with proper turn management
- [FR-005] Automatic reconnection handling for network issues
- [FR-006] Game integrity validation to prevent cheating
- [FR-007] Support for 2-10 players per game

### Non-Functional Requirements
- [NFR-001] <100ms latency for game actions
- [NFR-002] Connection reliability >95% for stable networks
- [NFR-003] Graceful degradation during network issues
- [NFR-004] No server costs for gameplay (signaling server optional)
- [NFR-005] Works on modern browsers with WebRTC support

### User Stories
- As a player, I want to create a game room so that I can invite friends to play
- As a player, I want to join a game via URL so that I can easily connect with others
- As a player, I want reliable real-time gameplay so that network issues don't ruin the game
- As a player, I want the game to handle disconnections so that I can continue playing after temporary network issues

## Technical Specification

### API Interface
```typescript
// Core P2P interfaces
interface GameRoom {
  id: string;
  players: Player[];
  gameState: UnoGameState;
  isActive: boolean;
}

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isConnected: boolean;
  hand: Card[];
}

interface P2PConnection {
  roomId: string;
  peers: PeerConnection[];
  isConnected: boolean;
  signalingState: SignalingState;
}

// Hook interfaces
interface UseP2PGameReturn {
  room: GameRoom | null;
  player: Player | null;
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (roomId: string, playerName: string) => Promise<void>;
  leaveRoom: () => void;
  sendGameAction: (action: GameAction) => void;
  connectionState: ConnectionState;
}
```

### Data Structures
```typescript
// WebRTC and synchronization types
type SignalingState = 'disconnected' | 'connecting' | 'connected' | 'error';
type ConnectionState = 'idle' | 'creating' | 'joining' | 'connected' | 'reconnecting' | 'error';

type GameAction =
  | { type: 'PLAY_CARD'; card: Card; playerId: string }
  | { type: 'DRAW_CARD'; playerId: string }
  | { type: 'CALL_UNO'; playerId: string }
  | { type: 'CHALLENGE_UNO'; challengerId: string; targetId: string }
  | { type: 'END_TURN'; playerId: string };

// Yjs document structure for CRDT sync
interface YGameState {
  players: Y.Map<Player>;
  currentPlayer: Y.Text;
  direction: Y.Text;
  deck: Y.Array<Card>;
  discardPile: Y.Array<Card>;
  gamePhase: Y.Text;
  winner: Y.Text;
}
```

### Component Structure
```typescript
// Main P2P game hook
const useP2PGame = (): UseP2PGameReturn => {
  // WebRTC connection management
  // Yjs state synchronization
  // Game logic integration
};

// Room management components
const GameRoom: React.FC = () => {
  const { room, createRoom, joinRoom } = useP2PGame();

  return (
    <div>
      {!room ? (
        <RoomSetup onCreate={createRoom} onJoin={joinRoom} />
      ) : (
        <UnoGame room={room} />
      )}
    </div>
  );
};
```

### State Management
- **WebRTC Connections**: Managed via @jbatch/webrtc-client hooks
- **Game State**: Synchronized using Yjs CRDTs across all peers
- **Local State**: React Context for UI state and connection status
- **Persistence**: URL-based room IDs, no server-side persistence needed

### Error Handling
- **Connection Failures**: Automatic retry with exponential backoff
- **Peer Disconnections**: Graceful handling with reconnection attempts
- **State Conflicts**: Yjs handles automatic conflict resolution
- **Network Errors**: User-friendly error messages and recovery options

## Implementation Notes

### Architecture Decisions
- **WebRTC Library**: @jbatch/webrtc-client for React integration and connection management
- **State Sync**: Yjs for CRDT-based synchronization to handle conflicts automatically
- **Signaling**: Minimal signaling server or serverless options (Trystero)
- **Connection Topology**: Mesh network where each peer connects to all others
- **Cheating Prevention**: Client-side validation with optional cryptographic verification

### Design Patterns
- **Custom Hook Pattern**: useP2PGame hook encapsulates all P2P logic
- **Observer Pattern**: Yjs observers for reactive state updates
- **Strategy Pattern**: Different synchronization strategies for different game phases
- **Error Boundary**: React error boundaries for connection failures

### Code Organization
```
src/
├── hooks/
│   └── use-p2p-game.ts        # Main P2P game hook
├── multiplayer/
│   ├── webrtc/
│   │   ├── connection.ts      # WebRTC connection management
│   │   ├── signaling.ts       # Signaling logic
│   │   └── peer-manager.ts    # Peer lifecycle management
│   ├── sync/
│   │   ├── yjs-setup.ts       # Yjs document initialization
│   │   ├── state-sync.ts      # Game state synchronization
│   │   └── conflict-resolution.ts # Conflict handling
│   └── types.ts               # P2P type definitions
├── components/
│   ├── room/
│   │   ├── room-setup.tsx     # Create/join room UI
│   │   ├── player-list.tsx    # Connected players display
│   │   └── connection-status.tsx # Connection indicators
│   └── game/
│       └── p2p-uno-game.tsx   # P2P-enabled game component
```

### Testing Strategy
- **Unit Tests**: WebRTC connection logic, state synchronization
- **Integration Tests**: Full P2P game flow with mock peers
- **E2E Tests**: Multi-browser testing with Playwright
- **Network Tests**: Simulate connection failures and reconnections

### Security Strategy
- **Input Validation**: All game actions validated on each peer
- **State Verification**: CRDT-based consistency checks
- **Cheating Detection**: Statistical analysis of player behavior
- **Optional Server Validation**: Can add server verification layer later

## Acceptance Criteria

### Functional Tests
- [ ] Can create a game room and get a shareable URL
- [ ] Multiple players can join the same room via URL
- [ ] P2P connections establish successfully between all players
- [ ] Game state synchronizes in real-time across all peers
- [ ] Turn-based gameplay works correctly with proper turn management
- [ ] Players can play cards and the game state updates for everyone
- [ ] Game handles player disconnections and reconnections gracefully

### Edge Cases
- [ ] Network interruptions during gameplay
- [ ] One peer loses connection and reconnects
- [ ] Browser tab refresh during active game
- [ ] Multiple players joining simultaneously
- [ ] Game state conflicts and resolution
- [ ] Browser compatibility issues

### Performance Criteria
- [ ] Game actions propagate within 100ms across peers
- [ ] Connection establishment takes <5 seconds
- [ ] Memory usage remains stable during long games
- [ ] Battery impact minimal on mobile devices

### Security Requirements
- [ ] Game state cannot be manipulated by malicious peers
- [ ] Player actions are validated on all clients
- [ ] No sensitive data exposed in P2P communication
- [ ] Resistance to common WebRTC attacks

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
- Set up WebRTC dependencies and basic connection
- Implement room creation and URL sharing
- Basic peer discovery and connection establishment

### Phase 2: State Synchronization (Week 2)
- Integrate Yjs for CRDT-based state sync
- Implement game state synchronization
- Handle basic conflict resolution

### Phase 3: Game Integration (Week 3)
- Integrate P2P system with existing Uno game logic
- Implement turn management and action validation
- Add connection status indicators

### Phase 4: Reliability & Polish (Week 4)
- Implement reconnection handling
- Add error boundaries and recovery mechanisms
- Performance optimization and testing

## References

- [WebRTC MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [@jbatch/webrtc-client Documentation](https://www.npmjs.com/package/@jbatch/webrtc-client)
- [Yjs Documentation](https://yjs.dev/)
- [WebRTC P2P Game Examples](https://github.com/topics/webrtc-game)
- [Uno Game Rules Reference](https://en.wikipedia.org/wiki/Uno_(card_game))

---

*Spec Version: 1.0 | Status: Approved | Ready for Implementation*