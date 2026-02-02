## Why

When a user creates a new room, they should automatically become the host. Currently, the host detection logic waits for the `synced` event from `y-webrtc`, but this event only fires when syncing with other peers. When you're the first person in a new room, you never receive this event, so host status is never claimed.

## What Changes

- Fix host detection in `useRoom` hook to claim host status immediately upon connection
- Remove dependency on `synced` event for initial host claim
- Add logic to detect if we're the first peer in the room

## Capabilities

### Modified Capabilities
- `p2p-networking`: Update host detection logic to work for room creators

## Impact

- Update to `hooks/useRoom.ts` host claim logic
- No breaking changes to existing functionality
