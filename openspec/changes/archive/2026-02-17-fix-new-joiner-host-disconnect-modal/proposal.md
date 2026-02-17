## Why

Guests who join an existing room can briefly see a false "Host Disconnected" state before they are prompted for their name. This breaks the expected lobby flow and can incorrectly eject valid joiners, so host identity and host presence need explicit tri-state handling during initial sync.

## What Changes

- Define host identity as tri-state during room bootstrap: `undefined` (unknown), `null` (known-unclaimed), or `number` (known host).
- Prevent host-disconnect UX from rendering during the initial unresolved-host grace period.
- Treat unresolved host identity (`hostId === undefined`) as a no-host condition after a 3-second grace period and show disconnect UX.
- Require confirmed host absence for known hosts (`hostId` is a concrete client ID) before showing disconnect UX.
- Preserve the existing requirement that all players, including guests and creators, are prompted for name entry on join.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `lobby-management`: Refine join/bootstrap behavior so unresolved host identity never blocks the name prompt or triggers host-disconnect UX; require confirmed disconnection semantics for disconnect modal display.

## Impact

- Affected systems: room bootstrap state derivation, host presence gating, and lobby modal precedence.
- Affected UX: join flow reliability for new guests joining existing rooms.
- No API or dependency changes expected.
