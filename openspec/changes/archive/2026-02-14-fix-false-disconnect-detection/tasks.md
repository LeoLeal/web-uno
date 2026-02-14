## 1. Add Host Guard

- [x] 1.1 Add `isHost: boolean` to `UseSessionResilienceOptions` interface in `hooks/useSessionResilience.ts`
- [x] 1.2 Add early-return `if (!isHost)` guard to disconnect detection effect (line 83)
- [x] 1.3 Add early-return `if (!isHost)` guard to replacement player effect (line 134)
- [x] 1.4 Add `if (!isHost)` guard to `continueWithout` callback for defense in depth
- [x] 1.5 Pass `amIHost` as `isHost` to `useSessionResilience` in `app/room/[id]/page.tsx`

## 2. Add Grace Period

- [x] 2.1 Add `DISCONNECT_GRACE_PERIOD_MS = 5000` constant in `useSessionResilience.ts`
- [x] 2.2 Add `pendingDisconnectsRef` (`useRef<Set<number>>`) to track suspected disconnects
- [x] 2.3 Add `activePlayersRef` (`useRef`) that syncs with `activePlayers` on each render
- [x] 2.4 Add `gracePeriodTimerRef` (`useRef<NodeJS.Timeout>`) for the timer handle
- [x] 2.5 Refactor disconnect detection effect: on mismatch, add to `pendingDisconnectsRef` and start timer instead of immediately writing to Yjs
- [x] 2.6 In the timer callback, re-check `activePlayersRef.current` against `lockedPlayers` — only write `PAUSED_WAITING_PLAYER` + orphanHands if players are still absent
- [x] 2.7 In the effect body, check if previously-pending players have returned — remove them from `pendingDisconnectsRef` and clear timer if no suspects remain

## 3. Timer Cleanup

- [x] 3.1 Clear `gracePeriodTimerRef` in the disconnect detection effect's cleanup function
- [x] 3.2 Clear `gracePeriodTimerRef` and reset `pendingDisconnectsRef` when status leaves `PLAYING`/`PAUSED_WAITING_PLAYER`

## 4. Tests

- [x] 4.1 Update existing tests in `hooks/useSessionResilience.test.ts` to pass `isHost: true` where disconnect detection is expected
- [x] 4.2 Add test: non-host peer does not trigger pause when awareness mismatch occurs (`isHost: false`)
- [x] 4.3 Add test: transient disconnect within grace period does not trigger pause (player reappears before 5s)
- [x] 4.4 Add test: genuine disconnect after grace period triggers pause (player absent for >5s)
- [x] 4.5 Add test: timer is cleared on unmount (no stale timer fires)
- [x] 4.6 Run full test suite (`npm run test`) and lint (`npm run lint`) to verify no regressions
