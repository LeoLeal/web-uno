## Why

The public `signaling.yjs.dev` server is unreliable and unsuitable for consistent development. We need a robust, locally hosted signaling server that runs alongside the Next.js application to ensure reliable P2P connection establishment during development and production.

## What Changes

- Create a dedicated signaling server script (`scripts/signaling.ts`).
- Update `package.json` to include a `signaling` script.
- Update the `useRoom` hook to connect to `ws://localhost:4444` (or configured URL) instead of the public server.
- Allow configuration of the signaling URL via environment variables.

## Capabilities

### New Capabilities
- `signaling-infrastructure`: Defines the requirements for the signaling server (port, protocol, health check).

### Modified Capabilities
- `p2p-networking`: Update connection requirements to support configurable signaling URLs.

## Impact

- New dev dependency (likely `ws` and `@types/ws`).
- `package.json` scripts updated.
- `useRoom` hook logic updated.
