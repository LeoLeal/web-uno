## 1. Move Modal Components

- [x] 1.1 Move `GameSettingsModal.tsx` from `components/lobby/` to `components/modals/`
- [x] 1.2 Move `GameSettingsModal.test.tsx` from `components/lobby/` to `components/modals/`
- [x] 1.3 Move `HostDisconnectModal.tsx` from `components/lobby/` to `components/modals/`
- [x] 1.4 Move `JoinGameModal.tsx` from `components/lobby/` to `components/modals/`

## 2. Update Import Paths

- [x] 2.1 Update `app/room/[id]/page.tsx` imports for `HostDisconnectModal` and `JoinGameModal`
- [x] 2.2 Update `components/lobby/GameSettingsPanel.tsx` import for `GameSettingsModal`
- [x] 2.3 Update `components/lobby/Accessibility.test.tsx` imports for `JoinGameModal`, `HostDisconnectModal`, and `GameSettingsModal`

## 3. Verify

- [x] 3.1 Run `tsc --noEmit` — zero type errors
- [x] 3.2 Run `npm test` — all existing tests pass
- [x] 3.3 Run `npm run lint` — no lint errors
