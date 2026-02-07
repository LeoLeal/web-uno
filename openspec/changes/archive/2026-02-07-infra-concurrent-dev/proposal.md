## Why

Developers currently need to run two separate terminal commands (`npm run dev` and `npm run signaling`) to start the development environment. This adds friction and cognitive load. Consolidating these into a single command improves Developer Experience (DX) and ensures the signaling server is always running when needed.

## What Changes

- Install `concurrently` as a dev dependency.
- Create new `dev:next` and `dev:signaling` scripts in `package.json`.
- Update the main `dev` script to run both services in parallel with color-coded output.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- `package.json`: Scripts and dependencies.
- **DX**: Running `npm run dev` will now start the full stack.
