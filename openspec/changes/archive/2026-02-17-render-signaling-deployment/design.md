## Context

The signaling server (`scripts/signaling.ts`) is an ~80-line WebSocket pub/sub broker that helps peers exchange SDP/ICE candidates for WebRTC connection. Once peers connect directly, the signaling server is idle. It currently uses the `ws` library to create a standalone `WebSocketServer` on a configurable port.

For production, we need zero-cost hosting. Render's free tier supports WebSockets, provides 750 hours/month (enough for 24/7), and deploys from Docker. The only gap: Render spins down free services after 15 minutes of inactivity. An external cron service pinging an HTTP health endpoint every ~14 minutes keeps the server alive.

## Goals / Non-Goals

**Goals:**

- Add an HTTP health endpoint (`GET /health`) to the signaling server
- Share a single port between HTTP and WebSocket traffic (Render exposes one port per service)
- Provide a `Dockerfile` for the signaling server so Render can build and run it
- Provide a `render.yaml` blueprint for one-click Render deployment

**Non-Goals:**

- Changing how `y-webrtc` connects to the signaling server (no client-side changes)
- Adding authentication, rate limiting, or TLS to the signaling server (Render handles TLS termination)
- Hosting the SPA on Render (SPA is a separate deployment concern)
- Setting up the external cron service (user configures cron-job.org / UptimeRobot manually)

## Decisions

### Decision 1: Shared HTTP + WebSocket server on a single port

**Choice:** Create a Node `http.Server`, attach the `ws.WebSocketServer` to it via the `server` option, and add a request handler for HTTP health checks.

**Why:** Render exposes a single port (`PORT` env var). The `ws` library natively supports attaching to an existing HTTP server, making this a minimal change. The current `new WebSocketServer({ port })` becomes `new WebSocketServer({ server: httpServer })`.

**Alternatives considered:**
- Separate HTTP and WS ports — incompatible with Render (one port per service)
- Reverse proxy (nginx) in container — unnecessary complexity for a health endpoint

### Decision 2: Dockerfile with multi-stage build

**Choice:** A multi-stage Dockerfile: build stage compiles TypeScript via `tsx`, runtime stage runs with minimal Node image.

**Why:** Keeps the image small. Only production dependencies (`ws`) are needed at runtime. `tsx` can run TypeScript directly, so we don't need a separate compile step — but we still benefit from a smaller final image by excluding devDependencies.

**Actually — simpler approach:** Since `tsx` runs TypeScript directly and the signaling server is a single file with one dependency (`ws`), we can use a single-stage image with `tsx` and skip the multi-stage complexity.

**Final choice:** Single-stage Dockerfile. Install only `ws` and `tsx` as runtime deps, copy `scripts/signaling.ts`, run with `tsx`.

### Decision 3: render.yaml blueprint

**Choice:** Include a `render.yaml` at the project root defining a single web service for the signaling server.

**Why:** Render's Infrastructure-as-Code format. One click to deploy. Specifies the Docker build context, port, and service type.

### Decision 4: Health endpoint response

**Choice:** `GET /health` returns `200 OK` with `{ "status": "ok" }` JSON body. All other HTTP requests return `404`.

**Why:** Simple, standard, sufficient for cron ping services. The JSON body helps with debugging/monitoring.

## Risks / Trade-offs

- **Render free tier changes** → Low risk. If Render changes their free tier, the same Dockerfile works on any Docker host. The `render.yaml` is a convenience, not a lock-in.
- **Cron service reliability** → If the cron service misses a ping, Render spins down the server. Next connection has a ~30-60s cold start. Mitigation: use two cron services for redundancy, or accept occasional cold starts.
- **Single point of failure** → The signaling server is a single instance. If it crashes, all new room creation fails (existing WebRTC connections are unaffected). Mitigation: Render auto-restarts crashed containers.

## Open Questions

_None — this is a straightforward change._
