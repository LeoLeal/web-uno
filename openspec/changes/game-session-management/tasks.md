## 1. State Management & Types

- [ ] 1.1 Update `GameStatus` enum to include `PAUSED_WAITING_PLAYER` <!-- id: 4 -->
- [ ] 1.2 Update `GameState` interface to include `orphanHands` array <!-- id: 5 -->
- [ ] 1.3 Add types for `OrphanHand` (`{ originalClientId, name, cards }`) <!-- id: 6 -->

## 2. Core Logic (Hooks)

- [ ] 2.1 Update `useGameEngine` to track online presence via Yjs Awareness <!-- id: 7 -->
- [ ] 2.2 Implement disconnection detection triggering `PAUSED_WAITING_PLAYER` <!-- id: 8 -->
- [ ] 2.3 Implement "Orphan Hand" storage logic on disconnection <!-- id: 9 -->
- [ ] 2.4 Implement Reconnection/Handover logic (name match -> reclaim hand) <!-- id: 10 -->
- [ ] 2.5 Implement Host "Continue Without Player" logic (reshuffle hand, remove player) <!-- id: 11 -->
- [ ] 2.6 Implement "Win by Walkover" check and state transition <!-- id: 12 -->

## 3. UI Components

- [ ] 3.1 Create `WaitingForPlayerModal` component <!-- id: 13 -->
- [ ] 3.2 Add Host controls to `WaitingForPlayerModal` (remove player buttons) <!-- id: 14 -->
- [ ] 3.3 Create `WinByWalkoverModal` or update existing Game End modal <!-- id: 15 -->
- [ ] 3.4 Integrate modals into `GameBoard` <!-- id: 16 -->

## 4. Testing & Verification

- [ ] 4.1 Unit Integration tests for `useGameEngine` disconnection/reconnection logic <!-- id: 17 -->
- [ ] 4.2 Manual verification of disconnect/reconnect flow <!-- id: 18 -->
- [ ] 4.3 Manual verification of Host "Continue Without" flow <!-- id: 19 -->
