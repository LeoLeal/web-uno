## Why

The current room creation flow uses a server-side route (`app/create/route.ts`) to generate room IDs and set cookies. This incurs unnecessary server computation and cost when room ID generation and creator intent tracking can be done entirely client-side with `sessionStorage`.

## What Changes

- **Delete** the server-side `/create` route handler
- **Convert** "Create New Game" from `<Link>` to `<button>` with client-side navigation
- **Replace** cookie-based creator detection with `sessionStorage`
- **Add** defensive cleanup of stale creator intent on home page load

## Capabilities

### New Capabilities

<!-- None - this is a refactoring of existing behavior -->

### Modified Capabilities

- `lobby-management`: Host claiming mechanism changes from cookie detection to sessionStorage detection. No functional change to user-facing behavior.

## Impact

- `app/create/route.ts`: **DELETE** - No longer needed
- `app/page.tsx`: Convert Create link to button with onClick handler
- `hooks/useRoom.ts`: Replace `document.cookie` check with `sessionStorage.getItem()`
- Loses "Open in New Tab" for game creation (acceptable trade-off)
