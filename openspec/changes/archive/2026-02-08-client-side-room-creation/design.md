## Context

Current room creation uses a server-side route (`app/create/route.ts`) that:

1. Generates a friendly room ID
2. Sets a `room-creator` cookie
3. Redirects to `/room/{id}`

The client (`useRoom.ts`) reads the cookie to determine creator intent and claim host status. This works but incurs server-side compute for what can be purely client-side logic.

## Goals / Non-Goals

**Goals:**

- Eliminate server compute costs for room creation
- Maintain reliable host claiming (no race conditions)
- Keep security properties equivalent or better

**Non-Goals:**

- Preserving "Open in New Tab" for game creation
- Changing the P2P host claiming logic in Yjs
- Modifying how guests join rooms

## Decisions

### 1. Use `sessionStorage` instead of cookies

**Choice**: Store creator intent in `sessionStorage` with key `room-creator` and value of the room ID.

**Alternatives considered**:

- **Cookies (client-side)**: Same security as sessionStorage, but more complex to parse and clear. No benefit.
- **URL query params**: Would be visible to anyone sharing the link, security concern.
- **Signed tokens**: Overkill for this use case; P2P model already handles race conditions via CRDT.

**Rationale**: `sessionStorage` is tab-scoped (can't leak between tabs), automatically clears on session end, and is simpler to work with than cookies.

### 2. Convert `<Link>` to `<button>` for Create Game

**Choice**: Use a `<button>` with `onClick` handler that generates ID, stores intent, and calls `router.push()`.

**Trade-off**: Loses native "Open in New Tab" browser behavior.

**Rationale**: Acceptable trade-off per discussion. Join flow still uses `<Link>` and works with new tabs.

### 3. Defensive cleanup on home page

**Choice**: Clear `sessionStorage.removeItem('room-creator')` on home page mount.

**Rationale**: Prevents edge case where user creates a room, navigates away without visiting it, and later manually types the same room URL—they shouldn't auto-claim host in that scenario.

## Risks / Trade-offs

| Risk                                      | Mitigation                                 |
| ----------------------------------------- | ------------------------------------------ |
| User expects "Open in New Tab" for create | Accept trade-off; join works with new tabs |
| Shared computer: stale sessionStorage     | Defensive cleanup on home page load        |
| SSR hydration mismatch                    | Already handled via `useEffect` in hook    |
