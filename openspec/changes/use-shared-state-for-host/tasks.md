## 1. Implement Shared State Host Management

- [x] 1.1 Update `hooks/useRoom.ts` to remove all setTimeout-based checks
- [x] 1.2 Add `hostId` field to Yjs `gameState` map
- [x] 1.3 Implement atomic check-and-set: if `hostId` is null, set to my clientId
- [x] 1.4 Determine isHost by checking `gameState.get('hostId') === myClientId`
- [x] 1.5 Remove awareness-based peer counting for host detection
- [x] 1.6 Update `app/room/[id]/page.tsx` to use new `amIHost` and `hostId` from hook
- [x] 1.7 Update `components/lobby/PlayerList.tsx` to accept and use `hostId` prop
- [x] 1.8 Export `hostId` and `amIHost` from useRoom hook
