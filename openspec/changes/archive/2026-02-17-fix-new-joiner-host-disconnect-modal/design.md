## Context

The room bootstrap path currently derives host availability before host identity is fully resolved from shared state. During this short window, joiners can be marked as host-disconnected and shown `HostDisconnectModal` before they are prompted for name entry. This violates the lobby requirement that all players are prompted for name input on join.

The change is focused on lobby bootstrap semantics: host identity resolution, host presence derivation, and modal gating precedence. No gameplay rules, networking protocol changes, or persistence changes are required.

## Goals / Non-Goals

**Goals:**
- Prevent false host-disconnected UX during initial join synchronization.
- Define explicit tri-state host identity semantics during bootstrap.
- Ensure join-name modal remains available while host identity is unresolved.
- Show host-disconnect modal only after confirmed host absence.

**Non-Goals:**
- Changing host election/ownership model beyond bootstrap semantics.
- Changing gameplay disconnection handling in active rounds.
- Adding new backend services, APIs, or dependencies.

## Decisions

### 1. Use tri-state host identity during bootstrap

Host identity is modeled as:
- `undefined`: unresolved (sync/bootstrap in progress)
- `null`: resolved and currently unclaimed
- `number`: resolved and claimed by a host client ID

This separates "unknown" from "known absent," which prevents accidental disconnect conclusions during early sync.

Alternative considered: keep boolean-only host-connected flag. Rejected because it conflates unresolved and disconnected states and caused the bug.

### 2. Derive host presence with unresolved-host timeout

Host presence is computed as:
- `hostId` is `number`: evaluate awareness to determine connected vs disconnected.
- `hostId` is `undefined`: treat as unresolved for a short grace period, then classify as disconnected if still unresolved.
- `hostId` is `null`: keep presence unknown (resolved-but-unclaimed state).

The unresolved-host grace period is fixed at 3 seconds. This keeps initial joins smooth while still allowing hostless rooms to transition out of limbo so players can recover by leaving/recreating rather than being permanently blocked.

Alternative considered: keep unresolved host identity permanently unknown. Rejected because hostless rooms can become stuck in a non-startable state.

### 3. Make lobby modal precedence explicit

Join flow precedence:
1. If room is full or game already started, show corresponding blocking modal.
2. Otherwise, if user has not joined yet, show Join Game modal while host identity/presence is unresolved or connected.
3. Show Host Disconnect modal when either (a) known host absence is confirmed or (b) unresolved-host grace timeout expires.

This preserves the expected UX for new joiners and aligns with player-name requirements.

## Risks / Trade-offs

**[Risk: delayed host-disconnect surfacing]** -> A stricter confirmation threshold may delay modal display by a short interval. **Mitigation:** prefer brief delay over false positives that eject valid joiners.

**[Risk: state complexity]** -> Tri-state identity plus derived presence increases mental model complexity. **Mitigation:** centralize state derivation in room hook and document transitions clearly.

**[Risk: regression in creator flow]** -> Creator immediate-claim path could be impacted by stricter gating. **Mitigation:** keep explicit creator claim behavior unchanged and verify creator still sees name prompt.

## Migration Plan

No data migration is required. Rollout is code-only and backward-compatible with existing room documents.

Rollback strategy: revert bootstrap tri-state/presence derivation changes in the room hook and modal gating conditions if regressions are observed.

## Open Questions

- Should confirmed host absence require a small grace delay after host ID resolution, or is a single awareness check sufficient for lobby state?
- Should lobby UX show a neutral "Connecting to host..." hint when host identity is unresolved for extended periods?
