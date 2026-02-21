# P2P Uno

A serverless, peer-to-peer (P2P) multiplayer Uno game running entirely in the browser.

[![pages-build-deployment](https://github.com/LeoLeal/web-uno/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/LeoLeal/web-uno/actions/workflows/pages/pages-build-deployment)
![Cron job status](https://api.cron-job.org/jobs/7282731/52dcf81063c01d9e/status-1.svg)

## 🚀 How to Run

To run the development environment:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start playing.

Run only the web app:

```bash
npm run dev:web
```

Run only the signaling server:

```bash
npm run signaling
```

## 🛠️ Technology Stack

- **Framework**: React SPA + Vite
- **Library**: React 19 (Hooks, Context)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS v4
- **State**: Yjs (CRDT) for P2P synchronization
- **Networking**: `y-webrtc` + Custom WebSocket Signaling

## 🏗️ Architecture

- **Topology**: Host-Authoritative game logic over a Mesh P2P network.
- **Security**: "Trusted Dealer" model (Partial). The Host solely controls and holds the private deck state in memory. However, currently, all dealt hands are synced to all peers via the shared Yjs document (clients filter and display only their own hands in the UI).
- **Discovery**: URL-based room sharing (no central lobby listing).
- **Resilience**: Direct peer-to-peer data sync via Yjs CRDT (requires active signaling connection).

## 📄 Documentation

- **`AGENTS.md`**: Guidelines for AI agents and developers.
- **`project.md`**: High-level project status and vision.
- **`openspec/`**: Detailed specifications and change history.

## 🌐 Deployment Requirements

This project is a browser-routed SPA and **requires host rewrite/fallback support**.

- Required behavior: non-asset routes (for example `/room/abcd-1234`) must serve `index.html` while preserving the URL.
- Required parity checks after deploy:
  - Open `/room/<id>` directly from a fresh tab.
  - Refresh while on `/room/<id>`.
  - Confirm both cases load the room flow instead of host 404.
- Unsupported hosts: providers that cannot configure SPA rewrites are not supported for production deployment.

## License

MIT
