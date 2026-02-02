## Why

When the host disconnects (closes browser, refreshes, or loses connection), the room becomes hostless and the game state is lost. Currently, remaining players are left in a broken lobby with no feedback. We need to detect host departure, notify all players, and gracefully return them to the home page to join a new game.

## What Changes

- Monitor host presence via Yjs awareness and shared state
- Detect when hostId points to a disconnected peer
- Display modal/alert: "Host disconnected. Game ended." with countdown
- Automatically redirect all players to home page after brief delay
- Clean up room state to prevent confusion

## Capabilities

### Modified Capabilities
- `lobby-management`: Add host disconnection detection and graceful exit flow
- `p2p-networking`: Monitor peer connection status and host presence

## Impact

- Update `hooks/useRoom.ts` to monitor host disconnection
- Add new UI component for host disconnect modal
- Update `app/room/[id]/page.tsx` to handle disconnect state
- Redirect logic with countdown timer
