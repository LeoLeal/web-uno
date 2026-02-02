## Why

There is a race condition in the host detection logic where a second player joining an existing room incorrectly claims host status. This happens because the new peer checks for existing hosts before their local awareness state has synced with the existing room peers, causing them to see peerCount=1 and think they're alone.

## What Changes

- Fix `hooks/useRoom.ts` host detection to wait for awareness sync before claiming host
- Add delay or use awareness change events to ensure we see all peers before host check
- Prevent late joiners from claiming host when a host already exists in the room
- Add re-check logic when awareness state updates with new peers

## Capabilities

### Modified Capabilities
- `p2p-networking`: Update host detection to handle awareness sync timing correctly

## Impact

- Critical fix to `hooks/useRoom.ts` host claim logic
- Ensures only first peer becomes host, late joiners always see existing host
- Improves reliability of multi-player room joins
