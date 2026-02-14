## Why

The "Waiting for players" modal appears randomly during gameplay even though no player actually disconnected. Players listed as "disconnected" in the modal can see the modal themselves — proving they're connected. This is caused by two issues in `useSessionResilience`: (1) disconnect detection runs on all peers instead of host-only (violating the spec), and (2) there is no grace period, so any momentary awareness flicker instantly triggers a false pause.

## What Changes

- Add host-only guard to disconnect detection in `useSessionResilience` — only the host should evaluate awareness mismatches and write `PAUSED_WAITING_PLAYER`
- Add a debounced grace period (3-5 seconds) before triggering the pause — if a "missing" player reappears within the grace window, no pause occurs
- Add host-only guard to the replacement player detection effect (same hook)

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `game-session`: Adding a grace period requirement to disconnection detection — the host must confirm a player remains absent for a minimum duration before triggering a pause, to filter out transient awareness flickers

## Impact

- `hooks/useSessionResilience.ts` — primary changes (host guard + debounce logic)
- `app/room/[id]/page.tsx` — needs to pass `amIHost` to the hook
- `hooks/useSessionResilience.test.ts` — tests updated for new behavior
