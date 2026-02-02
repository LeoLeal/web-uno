## 1. Dependencies & Setup

- [x] 1.1 Install dependencies (`ws`, `tsx`) and types (`@types/ws`).
- [x] 1.2 Create `.env.local` file with default `NEXT_PUBLIC_SIGNALING_URL`.

## 2. Signaling Server Implementation

- [x] 2.1 Create `scripts/signaling.ts` implementing the minimal `y-webrtc` signaling protocol (Pub/Sub).
- [x] 2.2 Add `signaling` script to `package.json` to run the server.

## 3. Frontend Integration

- [x] 3.1 Update `hooks/useRoom.ts` to use `NEXT_PUBLIC_SIGNALING_URL` environment variable.

