## 1. Vite SPA foundation

- [x] 1.1 Add and configure Vite as the frontend build/runtime toolchain for the existing React app.
- [x] 1.2 Create/update frontend entrypoint wiring for SPA bootstrap outside Next.js App Router conventions.
- [x] 1.3 Update package scripts so documented frontend workflows run through Vite commands.

## 2. Routing compatibility migration

- [x] 2.1 Implement client-side route mapping for `/` and `/room/:id` with equivalent behavior to the current app flow.
- [x] 2.2 Add explicit handling for `/room` (no id) to redirect users to `/`.
- [x] 2.3 Verify deep-link behavior so direct navigation and refresh on `/room/:id` resolve correctly in SPA runtime.

## 3. Remove Next.js runtime coupling

- [x] 3.1 Remove Next.js runtime/configuration files and code paths that are no longer used by the SPA runtime.
- [x] 3.2 Remove Next.js-specific dependencies from project manifests and lockfile.
- [x] 3.3 Confirm no remaining frontend start/build path depends on Next.js.

## 4. Deployment requirements and documentation

- [x] 4.1 Document production hosting requirement for SPA rewrites/fallback to `index.html` for non-asset deep links.
- [x] 4.2 Add concrete deployment guidance and validation steps for `/room/:id` direct-link and refresh behavior.
- [x] 4.3 Document unsupported hosting stance for providers that cannot satisfy rewrite support.

## 5. Verification and test coverage

- [x] 5.1 Add or update route-level tests for `/`, `/room/:id`, and `/room` redirect behavior.
- [x] 5.2 Run lint, test, and typecheck to validate migration stability and fix any regressions.
- [x] 5.3 Execute multiplayer smoke validation against the signaling server to confirm join/sync parity after migration.
