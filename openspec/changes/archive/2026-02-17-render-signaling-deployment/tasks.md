## 1. Refactor Signaling Server

- [x] 1.1 Refactor `scripts/signaling.ts` to create an `http.Server` and attach the `WebSocketServer` to it via the `server` option (instead of standalone `{ port }`)
- [x] 1.2 Add HTTP request handler: `GET /health` returns `200` with `{ "status": "ok" }` JSON; all other routes return `404`
- [x] 1.3 Call `httpServer.listen(port)` instead of `WebSocketServer({ port })`

## 2. Tests

- [x] 2.1 Add tests for the health endpoint (`GET /health` returns 200 + JSON, unknown routes return 404)
- [x] 2.2 Verify existing WebSocket signaling behavior is unaffected (subscribe, publish, ping/pong still work)

## 3. Deployment Configuration

- [x] 3.1 Create `Dockerfile.signaling` at project root — single-stage Node image, install `ws` and `tsx`, copy `scripts/signaling.ts`, run with `tsx`
- [x] 3.2 Create `render.yaml` at project root — define a single Docker web service for the signaling server with the correct port and build context

## 4. Documentation

- [x] 4.1 Add deployment instructions to the render.yaml or a brief comment in the Dockerfile explaining how to deploy and set up a cron keepalive
