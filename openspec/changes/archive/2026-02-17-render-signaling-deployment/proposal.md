## Why

The signaling server needs a zero-cost hosting solution. Render's free tier (750 hours/month, WebSocket support) is a strong fit, but requires an HTTP health endpoint so external cron services (e.g., cron-job.org, UptimeRobot) can ping it every ~14 minutes to prevent Render's 15-minute idle spin-down.

## What Changes

- Add an HTTP health-check endpoint (`GET /health`) to the signaling server alongside the existing WebSocket server
- Add a `Dockerfile` for the signaling server to support Render's Docker-based deployment
- Add Render deployment configuration (`render.yaml`) for infrastructure-as-code setup

## Capabilities

### New Capabilities

_None — this change extends an existing capability._

### Modified Capabilities

- `signaling-infrastructure`: Adding an HTTP health-check endpoint requirement for deployment keepalive support

## Impact

- **Code**: `scripts/signaling.ts` — adds an HTTP server that shares the port with the WebSocket upgrade handler
- **Dependencies**: May use Node's built-in `http` module (no new deps) since `ws` supports attaching to an existing HTTP server
- **Deployment**: New `Dockerfile` and `render.yaml` at project root (or a `deploy/` directory)
- **Environment**: `VITE_SIGNALING_URL` will point to the Render-hosted URL in production
