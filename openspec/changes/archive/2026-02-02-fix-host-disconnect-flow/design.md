## Context

The current implementation has a race condition:
```typescript
setCountdown((prev) => {
  if (prev <= 1) {
    router.push('/');  // ❌ Called during state update
    return 0;
  }
  return prev - 1;
});
```

This causes Next.js errors because `router.push()` triggers navigation during React's render phase.

## Goals / Non-Goals

**Goals:**
- Navigate to home page smoothly without errors
- Keep countdown display working correctly
- Clean up all timers before navigation

**Non-Goals:**
- Changing the countdown duration
- Changing the modal UI/UX

## Decisions

### Separate Navigation from State Updates
- **Decision**: Use separate `useEffect` to watch countdown value
- **Implementation**: 
  - Effect 1: Countdown timer that just decrements state
  - Effect 2: Watches countdown value, navigates when it hits 0
- **Benefits**: Navigation happens outside render cycle, no race condition

### Cleanup Before Navigation
- **Decision**: Clear all intervals before calling `router.push()`
- **Rationale**: Prevents memory leaks and ongoing state updates

## Risks / Trade-offs

- None - this is a pure bug fix
