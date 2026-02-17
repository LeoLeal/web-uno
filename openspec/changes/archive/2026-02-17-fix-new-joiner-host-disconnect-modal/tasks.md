## 1. Host Identity and Presence Semantics

- [x] 1.1 Update room bootstrap state handling to represent host identity as tri-state (`undefined`, `null`, `number`)
- [x] 1.2 Refactor host presence derivation so disconnect can only be computed when host identity is a concrete client ID
- [x] 1.3 Ensure unresolved host identity does not immediately derive `isHostConnected === false`
- [x] 1.4 Add a 3-second grace timeout that derives host-disconnected when `hostId` remains `undefined`

## 2. Lobby Modal Gating and Join Flow

- [x] 2.1 Update room page modal conditions so Join Game remains eligible while host identity/presence is unresolved
- [x] 2.2 Gate Host Disconnect modal behind confirmed host absence only
- [x] 2.3 Preserve existing precedence for game-full and game-already-started blocking states

## 3. Regression Tests

- [x] 3.1 Add/extend tests for joiner bootstrap with unresolved host identity to verify Join Game modal appears
- [x] 3.2 Add/extend tests to verify Host Disconnect modal does not render during unresolved host bootstrap grace period
- [x] 3.3 Add/extend tests to verify Host Disconnect modal renders when host ID is resolved and host is confirmed absent
- [x] 3.4 Add/extend tests to verify unresolved host identity transitions to host-disconnected after 3 seconds

## 4. Verification

- [x] 4.1 Run targeted tests covering room bootstrap and modal gating flows
- [x] 4.2 Run full test suite (`npm run test`) and lint (`npm run lint`) to confirm no regressions
