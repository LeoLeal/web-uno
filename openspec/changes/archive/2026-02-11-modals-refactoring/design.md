## Context

Modal components are scattered across two directories:

- `components/lobby/` — contains `GameSettingsModal`, `HostDisconnectModal`, `JoinGameModal` plus their tests
- `components/modals/` — contains only `GameAlreadyStartedModal`

This inconsistency makes modal components harder to discover and breaks the convention that related components share a directory.

## Goals / Non-Goals

**Goals:**

- Consolidate all modal components under `components/modals/`
- Update all import paths in consumers and tests
- Maintain zero behavioral changes

**Non-Goals:**

- Refactoring modal internals or props
- Changing the base `Modal` UI component in `components/ui/`
- Adding barrel exports or an index file (can be done separately)

## Decisions

### Move files directly, no barrel export

Move each modal file individually and update imports to point to the specific file (e.g., `@/components/modals/GameSettingsModal`). A barrel `index.ts` would be nice but adds scope — it can be a follow-up.

**Alternative considered**: Create a barrel export in `components/modals/index.ts`. Rejected to keep this change minimal and focused.

### Keep Accessibility.test.tsx in `components/lobby/`

`Accessibility.test.tsx` tests multiple lobby components, not just modals. It stays in `components/lobby/` with updated imports pointing to the new modal paths.

## Risks / Trade-offs

- **Stale imports in other branches** → Low risk; no long-lived branches reference these modals. Mitigation: merge promptly.
- **Coverage report paths change** → Coverage HTML reports reference old paths. Mitigation: regenerate coverage after merge.
