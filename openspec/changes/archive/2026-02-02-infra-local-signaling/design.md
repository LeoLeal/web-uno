## Context

Currently, the app hardcodes `wss://signaling.yjs.dev`. This is a shared, unstable resource. We need a local alternative. `y-webrtc` provides a signaling server implementation in its package, often executable via `bin/server.js`.

## Goals / Non-Goals

**Goals:**
- Run a local WebSocket server that handles `y-webrtc` signaling protocol.
- Configure the frontend to connect to this local server in development.
- Allow production configuration via `NEXT_PUBLIC_SIGNALING_URL`.

**Non-Goals:**
- Scaling the signaling server (Redis adapter, etc.) - Single instance is fine for V1.
- Auth for signaling (Public access is fine for V1).

## Decisions

### Implementation: Custom Node Script
- **Decision**: Write a thin wrapper script `scripts/signaling.ts` using `ws` and implementing the minimal signaling logic (pub/sub for rooms).
- **Rationale**: The `y-webrtc` package documentation suggests running their binary, but a custom script allows us to control logging, port, and TypeScript integration easily. It's lightweight (< 100 lines).

### Configuration: Environment Variables
- **Decision**: Use `NEXT_PUBLIC_SIGNALING_URL`. Default to `ws://localhost:4444` if undefined.
- **Rationale**: Standard Next.js pattern.

## Risks / Trade-offs

- **Dev Complexity**: User now has to run *two* commands (`npm run dev` and `npm run signaling`).
  - *Mitigation*: We will add a `npm run dev:all` script later if needed, but for now `npm run signaling` + `npm run dev` is acceptable.
