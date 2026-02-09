# P2P Uno

A serverless, peer-to-peer (P2P) multiplayer Uno game running entirely in the browser.

## 🚀 How to Run

To run the development environment:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start playing.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19 (Hooks, Context)
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS v4
- **State**: Yjs (CRDT) for P2P synchronization
- **Networking**: `y-webrtc` + Custom WebSocket Signaling

## 🏗️ Architecture

- **Topology**: Host-Authoritative P2P (Star Network).
- **Security**: "Trusted Dealer" model. The Host holds the deck state; Guests only receive their own cards via encrypted private channels.
- **Discovery**: URL-based room sharing (no central lobby listing).
- **Resilience**: Direct peer-to-peer data sync (requires active signaling connection).

## 📄 Documentation

- **`AGENTS.md`**: Guidelines for AI agents and developers.
- **`project.md`**: High-level project status and vision.
- **`openspec/`**: Detailed specifications and change history.

## License

MIT
