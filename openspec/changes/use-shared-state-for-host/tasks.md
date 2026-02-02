## 1. Implement Shared State Host Management

- [x] 1.1 Update `hooks/useRoom.ts` to remove all setTimeout-based checks
- [x] 1.2 Add `hostId` field to Yjs `gameState` map
- [x] 1.3 Implement atomic check-and-set: if `hostId` is null, set to my clientId
- [x] 1.4 Determine isHost by checking `gameState.get('hostId') === myClientId`
- [x] 1.5 Remove awareness-based peer counting for host detection
- [x] 1.6 Fix TypeScript type error for synced event handler
- [x] 1.7 Test: First player creates room, hostId is set correctly
- [x] 1.8 Test: Second player joins, reads existing hostId, doesn't claim host
- [x] 1.9 Test: All players show consistent host identification
