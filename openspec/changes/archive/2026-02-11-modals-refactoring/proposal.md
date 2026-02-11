## Why

`GameSettingsModal`, `HostDisconnectModal`, and `JoinGameModal` currently live in `components/lobby/` despite being modal components. The project already has a dedicated `components/modals/` directory (where `GameAlreadyStartedModal` lives). Consolidating all modals into one location improves discoverability, enforces consistent structure, and aligns with the project's file-organization conventions.

## What Changes

- Move `GameSettingsModal.tsx` and `GameSettingsModal.test.tsx` from `components/lobby/` to `components/modals/`
- Move `HostDisconnectModal.tsx` from `components/lobby/` to `components/modals/`
- Move `JoinGameModal.tsx` from `components/lobby/` to `components/modals/`
- Update all import paths in consumers (`app/room/[id]/page.tsx`, `GameSettingsPanel.tsx`, `Accessibility.test.tsx`)
- No API, prop, or behavioral changes — pure file reorganization

## Capabilities

### New Capabilities

_None — this is a structural refactor only._

### Modified Capabilities

_None — no requirement-level changes._

## Impact

- **Files moved**: 4 component files + 1 test file → `components/modals/`
- **Import updates**: `app/room/[id]/page.tsx`, `components/lobby/GameSettingsPanel.tsx`, `components/lobby/Accessibility.test.tsx`
- **Risk**: Low — no logic changes, only path updates. Existing tests validate correctness after the move.
