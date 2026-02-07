## Why

A race condition currently allows a second user (Fast Joiner) to claim host status if they join and connect before the Room Creator's host claim has propagated. This results in the creator losing control of the room they just created.

## What Changes

- Modify room creation flow to use client-side navigation instead of server-side redirects.
- Use `sessionStorage` to flag the user's intent to create a specific room.
- Update `useRoom` hook to check for this flag and claim host immediately if present.
- Remove the server-side route `app/create/route.ts`.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->
- `lobby-management`: Update host claiming requirements to include explicit creator intent.

## Impact

- `app/page.tsx`: Logic for "Create Game" button.
- `app/create/route.ts`: Deleted.
- `hooks/useRoom.ts`: Host claiming logic.
