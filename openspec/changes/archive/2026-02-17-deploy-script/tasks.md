## 1. Dependencies and Configuration

- [x] 1.1 Install `gh-pages` as a devDependency
- [x] 1.2 Add `"deploy": "tsx scripts/deploy.ts"` script to `package.json`

## 2. SPA Fallback

- [x] 2.1 Create `public/404.html` — SPA redirect that preserves the path via sessionStorage for React Router

## 3. Deploy Script

- [x] 3.1 Create `scripts/deploy.ts` — interactive menu using `readline` with options: Web app, Signaling server, Both
- [x] 3.2 Implement GitHub Pages deploy function: run `vite build`, write `CNAME` (uno.leoleal.dev) into `dist/`, push with `gh-pages`
- [x] 3.3 Implement Render deploy function: read `RENDER_DEPLOY_HOOK_URL` from env, POST to it via `https` module, handle missing URL error
- [x] 3.4 Wire menu selection to deploy functions, supporting "Both" as sequential execution

## 4. Environment

- [x] 4.1 Add `RENDER_DEPLOY_HOOK_URL` to `.env.example` (or document in render.yaml) so the required env var is discoverable
