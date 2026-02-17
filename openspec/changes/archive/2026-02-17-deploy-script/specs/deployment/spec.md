## ADDED Requirements

### Requirement: Interactive Deploy Menu

The deploy script SHALL present an interactive numbered menu when invoked via `npm run deploy`.

#### Scenario: Menu display

- **WHEN** the user runs `npm run deploy`
- **THEN** the script displays a menu with three options:
  1. Web app (GitHub Pages)
  2. Signaling server (Render)
  3. Both

#### Scenario: User selects option

- **WHEN** the user enters a number (1, 2, or 3)
- **THEN** the script executes the corresponding deployment(s)

#### Scenario: Invalid selection

- **WHEN** the user enters an invalid option
- **THEN** the script displays an error and exits

### Requirement: GitHub Pages Deploy

The deploy script SHALL build the SPA and push it to the `gh-pages` branch when the web app deploy option is selected.

#### Scenario: Build and push

- **WHEN** the user selects web app deployment
- **THEN** the script runs `vite build`
- **AND** writes a `CNAME` file containing `uno.leoleal.dev` into the `dist/` directory
- **AND** pushes the `dist/` directory to the `gh-pages` branch using the `gh-pages` package

#### Scenario: Build failure

- **WHEN** the `vite build` command fails
- **THEN** the script reports the error and does not push to `gh-pages`

### Requirement: SPA Fallback for GitHub Pages

The project SHALL include a `404.html` in the `public/` directory that redirects to `index.html` while preserving the requested path.

#### Scenario: Direct navigation to deep link

- **WHEN** a user navigates directly to `uno.leoleal.dev/room/abc123`
- **AND** GitHub Pages serves `404.html`
- **THEN** the page redirects to `index.html`
- **AND** the original path `/room/abc123` is preserved for React Router to handle

### Requirement: Render Deploy Hook

The deploy script SHALL trigger the Render deploy hook when the signaling server deploy option is selected.

#### Scenario: Successful trigger

- **WHEN** the user selects signaling server deployment
- **AND** `RENDER_DEPLOY_HOOK_URL` is set in the environment
- **THEN** the script sends an HTTP POST to the deploy hook URL
- **AND** displays a success message

#### Scenario: Missing deploy hook URL

- **WHEN** the user selects signaling server deployment
- **AND** `RENDER_DEPLOY_HOOK_URL` is not set
- **THEN** the script displays an error message indicating the env var is missing
- **AND** does not attempt the deploy

### Requirement: Deploy Both

The deploy script SHALL support deploying both targets in sequence.

#### Scenario: Both selected

- **WHEN** the user selects "Both"
- **THEN** the script deploys the web app first, then triggers the Render deploy hook
- **AND** reports the result of each deployment independently
