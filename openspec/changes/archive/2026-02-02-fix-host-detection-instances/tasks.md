## 1. Fix Host Detection Race Condition

- [x] 1.1 Update `hooks/useRoom.ts` to delay host check for late joiners until awareness syncs
- [x] 1.2 Add multiple delayed checks (100ms, 500ms, 1000ms) to ensure awareness populates
- [x] 1.3 Add logic to detect and relinquish host if another host is found
- [x] 1.4 Add lowest-client-ID tie-breaker for edge cases
- [x] 1.5 Prevent host claim if any existing peer has `isHost: true`
- [x] 1.6 Test: First player creates room and becomes host
- [x] 1.7 Test: Second player joins and does NOT become host
- [x] 1.8 Test: Third player joins and does NOT become host
- [x] 1.9 Test: All players see correct host in player list
