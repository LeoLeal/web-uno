# P2P Uno

A serverless, peer-to-peer multiplayer Uno game running entirely in the browser.

## Vision

To create a frictionless, privacy-focused Uno experience that friends can play instantly by sharing a link, without account registration or centralized tracking.

## Core Architecture

- **Topology**: Host-Authoritative P2P (Star Network).
- **State Sync**: Yjs + WebRTC (Mesh for public state, Data Channels for private actions).
- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Security**: "Trusted Dealer" model (Host holds the deck, Guests only know their own cards).

## Key Capabilities

- **Instant Play**: Zero setup, URL-based lobby joining.
- **Responsive**: Mobile-first design (2-column mobile grid) for play on phones.
- **Resilient P2P**: Direct peer-to-peer data sync (requires active signaling connection).

## Status

- **Phase**: Initialization / Prototyping
- **Active Changes**: `infra-lobby-connection` (Lobby & Networking Foundation)
