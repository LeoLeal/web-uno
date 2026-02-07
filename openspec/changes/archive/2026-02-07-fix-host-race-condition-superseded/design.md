## Context

Currently, host claiming relies on `y-webrtc` peer discovery (`peerCount <= 1`) and a check for `hostId === null`. This is susceptible to race conditions where a fast joiner connects to signaling but hasn't yet discovered the creator, thus falsely believing they are the first peer and claiming host.

## Goals / Non-Goals

**Goals:**
- Eliminate the race condition for host claiming.
- Ensure the user who clicks "Create Game" becomes the host.
- Prevent fast joiners from accidental usurpation.

**Non-Goals:**
- Handling "Host Abandonment" (when a host leaves mid-game). That is a separate issue.

## Decisions

### 1. Client-Side Intent Flag (`sessionStorage`)
We will use `sessionStorage` to store a flag indicating the user intends to create a specific room.
- **Key**: `web-uno-created-room`
- **Value**: The `roomId` string.
- **Rationale**: `sessionStorage` survives the navigation from Home to Room, is tab-specific (doesn't leak to new tabs), and is invisible in the URL (secure against link sharing).

### 2. Client-Side Navigation
We will replace the server-side redirect (`app/create/route.ts`) with client-side logic in `app/page.tsx`.
- **Reason**: We need to write to `sessionStorage` *before* navigation, which requires client-side execution.

### 3. Immediate Claiming
In `useRoom.ts`, we will check `sessionStorage` on mount.
- If the stored `roomId` matches the current `roomId`:
  - Determine "I am the Creator".
  - Claim Host immediately (`gameState.set('hostId', myId)`).
  - Clear the storage item.
- **Rationale**: This bypasses the need to wait for peer discovery or network synchronization, as the intent is explicit.

## Risks / Trade-offs

- **Manual URL Creation**: If a user manually types a URL to create a room, they won't have the flag.
  - **Mitigation**: They will join as a guest. The room will have no host initially. The fallback election logic (or just waiting for sync) handles this eventually, or we accept that "valid" games start from the Home page.
