## Why

The current setTimeout-based approach for host detection is fragile and relies on timing guesses. We need a robust, deterministic solution that guarantees only one host exists regardless of network timing or join order.

## What Changes

- Replace timeout-based host detection with Yjs shared document state
- Store `hostId` (the clientId of the host) in the shared `gameState` Y.Map
- Implement atomic check-and-set: if `hostId` is null/undefined, set it to my clientId
- All players read hostId from shared state to determine who is host
- Eliminate all setTimeout delays and race condition complexity

## Capabilities

### Modified Capabilities
- `p2p-networking`: Replace timeout-based host detection with shared state approach

## Impact

- Simpler, more reliable `hooks/useRoom.ts` implementation
- Deterministic host assignment regardless of network conditions
- No timing-related edge cases or simultaneous join issues
- Shared state becomes single source of truth for room metadata
