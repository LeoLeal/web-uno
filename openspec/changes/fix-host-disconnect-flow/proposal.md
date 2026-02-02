## Why

The HostDisconnectModal component has a race condition where `router.push('/')` is called inside a `setState` callback. This causes Next.js errors because navigation happens during the render cycle, conflicting with React's rendering process.

## What Changes

- Fix `HostDisconnectModal.tsx` to separate countdown logic from navigation
- Use `useEffect` to watch countdown value and navigate only when it reaches 0
- Ensure navigation happens outside of state update callbacks
- Clean up timers properly before navigation to prevent memory leaks

## Capabilities

### Modified Capabilities
- `lobby-management`: Fix host disconnect modal navigation timing

## Impact

- Update `components/lobby/HostDisconnectModal.tsx` router navigation logic
- No breaking changes, purely fixing implementation bug
