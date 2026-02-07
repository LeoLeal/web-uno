## Context

We previously switched to client-side `sessionStorage` to prevent host takeover race conditions. This required changing the "Create Game" link to a button, which is less semantic and prevents opening in new tabs. We also introduced a bug where guests wouldn't see the Join Modal because `isSynced` wasn't being set.

## Goals / Non-Goals

**Goals:**
- **Robust Host Claiming**: Use cookies to safely pass "creator intent" from the creation route to the lobby.
- **Semantic HTML**: Restore the `<Link>` element for "Create Game".
- **Fix Guest UI**: Ensure guests can join and see the lobby even if peer sync is pending.

## Decisions

### 1. Cookie-Based Intent
We will use a cookie `room-creator=<roomId>` set by the server.
- **Security**: Scope the cookie to `Path=/room/<roomId>` so it only affects that specific room.
- **Expiry**: Set `Max-Age=60` (1 minute) to allow for slow redirections but prevent long-term persistence.
- **Access**: `HttpOnly: false` (or undefined, default is false) so client-side JS can read it via `document.cookie`.

### 2. Restore Server Route
We will re-create `app/create/route.ts`.
- It will generate the ID.
- Set the cookie.
- Redirect to the room.

### 3. Guest UI Unblocking
In `hooks/useRoom.ts`, if the user is NOT the creator:
- We will set `setIsSynced(true)` inside the `status` (connected) handler.
- We will NOT call `claimHostIfEligible()`.
- This ensures the UI (Modals) unlocks, but the user remains a guest until/unless they win an election or the host syncs.

## Risks / Trade-offs

- **Cookie Support**: Requires cookies to be enabled. Standard for web apps.
- **Timing**: If the redirect takes > 60s, the cookie expires and the creator joins as a guest. (Acceptable edge case, they can restart).
