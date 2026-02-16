## ADDED Requirements

### Requirement: Vite SPA runtime replaces Next.js runtime
The application SHALL run as a Vite-built React single-page application and SHALL NOT require Next.js runtime integration to start, build, or serve the frontend.

#### Scenario: Frontend runtime is Vite-based
- **WHEN** the frontend is built and started using the project's documented runtime workflow
- **THEN** the application runs through Vite SPA tooling without Next.js runtime participation

### Requirement: Route contract remains compatible
The frontend runtime SHALL preserve user-facing route compatibility for `/` and `/room/:id` so existing shared room links continue to resolve to the correct client flow.

#### Scenario: Home route remains available
- **WHEN** a user opens `/`
- **THEN** the application loads the lobby/home entry flow

#### Scenario: Room route remains available
- **WHEN** a user opens `/room/<id>`
- **THEN** the application loads the room flow for the provided room identifier

#### Scenario: Missing room id redirects to home
- **WHEN** a user opens `/room` without an id
- **THEN** the application redirects to `/`

### Requirement: Deep-link hosting rewrite support is mandatory
Production hosting MUST provide SPA rewrite/fallback behavior that serves `index.html` for non-asset deep links while preserving the requested URL.

#### Scenario: Deep link resolves through host rewrite
- **WHEN** a user directly navigates to `/room/<id>` on a production deployment
- **THEN** the host serves the SPA entry and the client router resolves the room route without redirecting away from `/room/<id>`

#### Scenario: Refresh preserves room route
- **WHEN** a user refreshes the browser on `/room/<id>`
- **THEN** the application reloads successfully and returns to the same room route

### Requirement: Next.js-specific dependencies are removed
The project MUST remove Next.js-specific dependencies from its frontend runtime dependency graph as part of migration completion.

#### Scenario: Dependency audit has no Next.js runtime packages
- **WHEN** project dependencies are reviewed at migration completion
- **THEN** Next.js-specific runtime packages are absent from the project dependency set
