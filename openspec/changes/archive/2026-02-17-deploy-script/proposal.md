## Why

There is no deployment workflow for the project. The web app needs to be deployed to GitHub Pages (at `uno.leoleal.dev` via custom subdomain), and the signaling server to Render (via deploy hook). An interactive `npm run deploy` script lets the developer choose which target(s) to deploy in a single command.

## What Changes

- Add a Node.js deploy script (`scripts/deploy.ts`) with an interactive menu (using built-in `readline`) that offers three options: deploy web app, deploy signaling server, or both
- Web app deploy: runs `vite build`, injects `CNAME` and `404.html` into `dist/`, pushes to `gh-pages` branch
- Signaling server deploy: triggers Render deploy hook via HTTP POST
- Add `gh-pages` as a devDependency for pushing built files to the `gh-pages` branch
- Add `npm run deploy` script to `package.json`
- Add `RENDER_DEPLOY_HOOK_URL` env var to `.env.local` (already done by user)

## Capabilities

### New Capabilities

- `deployment`: Covers the interactive deploy script, GitHub Pages build pipeline (CNAME, 404.html SPA fallback), and Render deploy hook trigger

### Modified Capabilities

_None — no existing spec-level behavior changes._

## Impact

- **New files**: `scripts/deploy.ts`, `public/404.html`
- **Modified files**: `package.json` (new script + devDependency)
- **Dependencies**: `gh-pages` (devDependency)
- **Environment**: `RENDER_DEPLOY_HOOK_URL` in `.env.local`
