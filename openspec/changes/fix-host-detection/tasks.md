## 1. Fix Host Detection

- [x] 1.1 Update `hooks/useRoom.ts` to claim host immediately when connecting to empty room
- [x] 1.2 Add check for `awareness.getStates().size === 1` to detect first peer
- [x] 1.3 Keep existing `synced` event handler for late joiners
- [x] 1.4 Test room creation shows "You are Host" badge
