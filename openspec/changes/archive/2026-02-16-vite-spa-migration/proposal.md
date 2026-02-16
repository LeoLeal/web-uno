## Why

The current app depends on Next.js App Router and SSR-oriented routing for `/room/[id]`, even though gameplay, state sync, and signaling are already client-driven. Migrating to a React SPA with Vite now reduces framework overhead and deployment complexity while preserving the existing multiplayer experience.

## What Changes

- Replace Next.js runtime/build infrastructure with Vite-based React SPA infrastructure.
- Preserve route compatibility for existing entry points, especially `/` and `/room/:id`.
- Define SPA deep-link requirements so direct navigation and refresh on `/room/:id` work in production.
- Keep signaling architecture unchanged: signaling server remains a separate service (`/scripts/signaling.ts`) and browser clients continue connecting to it.
- Remove Next.js-specific dependencies and runtime coupling from the project.

## Capabilities

### New Capabilities
- `frontend-runtime-platform`: Defines the frontend runtime contract for a Vite-powered React SPA, including route compatibility (`/` and `/room/:id`), deep-link fallback requirements, and removal of Next.js runtime dependencies.

### Modified Capabilities
- None.

## Impact

- Affected code: application bootstrap, routing setup, build tooling/configuration, and deployment configuration for SPA rewrites/fallback.
- APIs: no new backend APIs; no changes to signaling protocol.
- Dependencies: remove Next.js-specific packages and add Vite SPA toolchain dependencies.
- Systems: frontend hosting/deploy setup must support SPA deep-link handling for room URLs.
