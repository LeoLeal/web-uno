## Context

The project has two independent deployment targets: the SPA (GitHub Pages at `uno.leoleal.dev`) and the signaling server (Render). Currently neither has a deploy workflow. The developer wants a single `npm run deploy` command with an interactive menu to choose which target(s) to deploy.

## Goals / Non-Goals

**Goals:**

- Single interactive `npm run deploy` command using Node's built-in `readline` (no new deps for the menu)
- GitHub Pages deploy: build SPA, inject CNAME + 404.html, push to `gh-pages` branch
- Render deploy: trigger deploy hook URL via HTTP POST
- Both deployments are optional and independent

**Non-Goals:**

- CI/CD pipelines or GitHub Actions (local script only)
- Render CLI or API key auth (deploy hook is sufficient)
- Automatic deploys on push (explicit control is the goal)
- Setting up DNS or Render service (already done by user)

## Decisions

### Decision 1: Node script with readline for interactive menu

**Choice:** `scripts/deploy.ts` using Node's built-in `readline` module for the menu prompt.

**Why:** Zero new dependencies for the interactive part. The script is small (~80 lines). `readline` provides `question()` which is sufficient for a numbered menu (1/2/3).

**Alternatives considered:**
- Bash script with `select` — works but TypeScript is consistent with the codebase
- `inquirer` package — nicer UX but adds a dependency for a deploy script

### Decision 2: `gh-pages` npm package for GitHub Pages push

**Choice:** Use `gh-pages` devDependency to push `dist/` to the `gh-pages` branch.

**Why:** Handles the git mechanics of force-pushing a directory to an orphan branch. Well-maintained, standard tool for this. Avoids manual git branch manipulation in the script.

### Decision 3: 404.html SPA fallback

**Choice:** Place a `404.html` in `public/` that redirects to `index.html` preserving the path via session storage.

**Why:** GitHub Pages serves `404.html` for any unknown route. This file must redirect to `index.html` so React Router can handle the route. The standard approach uses a small inline script that stores the path in `sessionStorage`, redirects to `/`, and `index.html` reads it back. Placing it in `public/` means Vite copies it to `dist/` automatically on build — no post-build injection needed.

### Decision 4: CNAME file injection

**Choice:** Write `CNAME` file into `dist/` after build, before `gh-pages` push. Do NOT place in `public/` because it's deployment-specific.

**Why:** The `CNAME` file must be at the root of the `gh-pages` branch for GitHub to recognize the custom domain. Building fresh each deploy means we must add it after `vite build`. Keeping it out of `public/` avoids it appearing in dev server responses.

### Decision 5: Render deploy via HTTP POST

**Choice:** Use Node's built-in `https` module to POST to the Render deploy hook URL from `RENDER_DEPLOY_HOOK_URL` env var.

**Why:** Deploy hooks are a single URL POST with no auth headers needed (key is in the URL). No Render CLI dependency required. The env var is already in `.env.local`.

## Risks / Trade-offs

- **Deploy hook URL is a secret** → Stored in `.env.local` (gitignored). Script validates it exists before attempting deploy.
- **`gh-pages` package force-pushes** → This is expected behavior for GitHub Pages. The branch only contains built artifacts, not source.
- **404.html redirect flash** → Brief redirect on direct navigation to deep links. Imperceptible in practice.
