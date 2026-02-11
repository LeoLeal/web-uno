## Why

The codebase had 18 ESLint issues (5 errors, 13 warnings) that needed resolution. Three `react-hooks/set-state-in-effect` errors in modal components (`GameSettingsModal`, `HostDisconnectModal`) and `useRoom` indicated anti-patterns. Two `no-explicit-any` errors violated TypeScript strict typing guidelines. The ESLint config also lacked `.d.ts` file exclusions and the `_` prefix convention for intentionally unused variables.

## What Changes

- Refactor `GameSettingsModal` and `HostDisconnectModal` to use conditional rendering from parents, dropping the `isOpen` prop in favor of mount/unmount lifecycle for state reset
- Add `eslint-disable` for legitimate `setState` in `useRoom` (external WebRTC sync)
- Replace `any` with proper types in `useRoom.ts` and `signaling.ts`
- Update ESLint config to exclude `.d.ts` files and allow `_` prefixed unused variables
- Remove/prefix all unused variables across source and test files

## Capabilities

### Modified Capabilities

- `lobby-management`: Modal rendering refactored to use conditional rendering pattern
- `p2p-networking`: Type safety improved in `useRoom` awareness state
- `signaling-infrastructure`: Type safety improved in message parsing

## Impact

- `GameSettingsModal` and `HostDisconnectModal` no longer accept `isOpen` prop (breaking change for direct consumers)
- Parents (`GameSettingsPanel`, room `page.tsx`) updated to conditional rendering
- Test files updated to match new component APIs
- No functional behavior changes — purely structural/lint improvements
