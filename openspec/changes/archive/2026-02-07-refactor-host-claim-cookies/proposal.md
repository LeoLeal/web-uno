## Why

The previous attempt to fix host race conditions using `sessionStorage` required changing the "Create Game" link to a button, which degraded UX (no "Open in New Tab"). A cookie-based approach is more robust, secure, and preserves semantic HTML navigation while still effectively preventing host takeover. Additionally, we need to fix a regression where guests were blocked from seeing the Join Modal.

## What Changes

- Restore `app/create/route.ts` to handle room creation and redirection server-side.
- Set a short-lived `room-creator` cookie on the server before redirecting.
- Revert `app/page.tsx` to use a standard `<Link>` for navigation.
- Update `hooks/useRoom.ts` to detect creator intent via `document.cookie` instead of `sessionStorage`.
- **Fix**: Ensure guests (who don't claim host) still set `isSynced(true)` to unblock the UI.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `lobby-management`: Update implementation details for Host Claiming (cookie-based).

## Impact

- `app/create/route.ts`: Re-created.
- `app/page.tsx`: Reverted to use `Link`.
- `hooks/useRoom.ts`: Updated claim logic.
