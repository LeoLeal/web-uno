## Context

ESLint reported 5 errors and 13 warnings. The most impactful errors were `react-hooks/set-state-in-effect` violations in two modal components that used `useEffect` to reset state when `isOpen` changed. This is an anti-pattern — the React-recommended approach is conditional rendering so components remount with fresh initial state.

## Goals / Non-Goals

**Goals:**

- Zero lint errors and zero warnings
- Cleaner modal lifecycle via conditional rendering
- Proper TypeScript types replacing `any`
- ESLint config supporting common conventions (`.d.ts` exclusion, `_` prefix)

**Non-Goals:**

- Changing modal visual behavior or UX
- Refactoring other components beyond what lint requires
- Adding new lint rules

## Decisions

### Conditional Rendering for Modals

- **Decision**: Remove `isOpen` prop from `GameSettingsModal` and `HostDisconnectModal`; parents conditionally render them
- **Rationale**: When a component mounts fresh, `useState` initializers handle state reset naturally — no `useEffect` needed
- **Trade-off**: Components are now unmounted/remounted on each open, but this is negligible for modals

### ESLint-disable for useRoom

- **Decision**: Suppress `react-hooks/set-state-in-effect` for `setMyClientId(myId)` in `useRoom.ts`
- **Rationale**: This is legitimate syncing of state from an external system (WebRTC awareness) initialized inside the effect

### Underscore Prefix Convention

- **Decision**: Configure `argsIgnorePattern`, `varsIgnorePattern`, and `caughtErrorsIgnorePattern` with `^_`
- **Rationale**: Standard convention for intentionally unused variables; avoids false-positive warnings

## Risks / Trade-offs

- **Breaking internal API**: `GameSettingsModal` and `HostDisconnectModal` no longer accept `isOpen` — all consumers updated in this change
- **No runtime risk**: All changes are structural; no behavior changes
