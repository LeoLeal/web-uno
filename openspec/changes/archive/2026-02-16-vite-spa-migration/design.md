## Context

The product is a browser-first P2P Uno game where gameplay state and multiplayer sync already run on the client via Yjs and WebRTC, with a separate signaling service. The current framework dependency is primarily Next.js App Router conventions and SSR-oriented dynamic route handling for `/room/[id]`.

The migration target is a React SPA powered by Vite with minimal codebase impact. Route compatibility is a hard requirement: `/` and `/room/:id` must remain stable and shareable. Hosting is not finalized, so deep-link behavior must be specified in a host-agnostic way.

## Goals / Non-Goals

**Goals:**
- Replace Next.js runtime/build stack with Vite SPA runtime while preserving current user-visible behavior.
- Keep route contract compatibility for `/` and `/room/:id`, including direct URL entry and browser refresh behavior.
- Keep game logic, Yjs document usage, and signaling protocol/flow unchanged.
- Remove Next.js-specific dependencies from the project.
- Provide deployment requirements that work across static hosts with and without rewrite support.

**Non-Goals:**
- Redesign gameplay, lobby UX, or game rules.
- Introduce backend APIs, server rendering, or new server-side dependencies.
- Change signaling server architecture or transport protocol.
- Rework core domain modules beyond what is necessary for router/runtime adaptation.

## Decisions

1. **Compatibility-first migration strategy**
   - Decision: Use a single runtime swap approach focused on infrastructure boundaries (bootstrap, routing, build, deploy), not feature reimplementation.
   - Rationale: Minimizes code churn and regression risk while meeting the goal of removing Next.js.
   - Alternatives considered:
     - Big-bang full refactor: faster cleanup but higher risk.
     - Dual-runtime transition: lower migration risk for large apps but unnecessary complexity for current scope.

2. **Route contract preservation with client routing**
   - Decision: Implement SPA routing that explicitly maps `/` and `/room/:id` to equivalent screens/flows.
   - Rationale: Preserves existing shareable links and avoids user-facing behavior changes.
   - Alternatives considered:
     - Route redesign: rejected due to compatibility and rollout risk.

3. **Rewrite support is required for production hosting**
   - Decision: Require host-level SPA rewrite/fallback support so deep links to `/room/:id` are served via `index.html` while preserving URL.
   - Rationale: Room links are a core entry point; direct navigation and refresh must be reliable.
   - Alternatives considered:
     - Support hosts without rewrites: rejected due to broken deep-link behavior and added workaround complexity.

4. **No protocol or game-state model changes**
   - Decision: Keep Yjs schema/usage and signaling client behavior intact; treat migration as platform change only.
   - Rationale: Domain behavior is already client-side and should remain stable to reduce risk.
   - Alternatives considered:
     - Concurrent networking/state refactor: rejected as unnecessary scope expansion.

5. **Dependency cleanup as completion gate**
   - Decision: Define removal of Next.js-specific dependencies as a strict definition-of-done criterion.
   - Rationale: Prevents hidden coupling and ensures migration is truly complete.
   - Alternatives considered:
     - Keep temporary compatibility dependencies: rejected because it weakens migration guarantees.

## Risks / Trade-offs

- [Deep-link failures on unsupported hosts] -> Mitigation: require rewrite-capable hosting and verify `/room/:id` direct navigation and refresh before release.
- [Routing parity regressions] -> Mitigation: validate route-level behavior for home and room flows before and after migration.
- [Hidden Next.js coupling in app bootstrap/config] -> Mitigation: inventory and remove framework-specific dependencies/configs as explicit migration tasks.
- [Build/deploy pipeline drift during transition] -> Mitigation: define a single authoritative SPA build/deploy path and deprecate Next.js commands.

## Migration Plan

1. Establish Vite SPA entry/build scaffolding while preserving existing React domain modules.
2. Replace Next route handling with client routing for `/` and `/room/:id`.
3. Adapt app bootstrap points to Vite runtime conventions.
4. Remove Next.js-specific runtime/dependency/configuration references.
5. Add deployment guidance for SPA fallback and deep-link handling across host types.
6. Validate parity: room link open/refresh behavior, join flow, and multiplayer sync smoke checks.

Rollback strategy:
- Keep migration isolated in change scope until parity checks pass.
- If critical regressions appear, revert deployment to previous Next.js build artifact while issues are addressed.

## Open Questions

- Which production host will be selected first for the initial rollout (to finalize concrete rewrite config examples)?
