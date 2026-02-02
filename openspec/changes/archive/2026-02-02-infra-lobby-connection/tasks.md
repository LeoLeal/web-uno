## 1. Dependencies & Setup

- [x] 1.1 Install dependencies (`yjs`, `y-webrtc`, `simple-peer`, `uuid`).
- [x] 1.2 Create `GameContext` and provider to manage the global Yjs Doc instance.


## 2. Routing & Landing Page

- [x] 2.1 Update Landing Page (`/`) to include "Create Game" button.
- [x] 2.2 Implement utility to generate UUID and redirect to `/room/[id]`.
- [x] 2.3 Create the basic `/room/[id]/page.tsx` route structure.

## 3. P2P Networking Layer

- [x] 3.1 Implement `useRoom` hook that initializes `y-webrtc` provider with the room ID.
- [x] 3.2 Implement Yjs Awareness logic to track connected peers and their metadata (name).
- [x] 3.3 Implement Host detection logic (determine if local peer is the Host).

## 4. Lobby UI

- [x] 4.1 Build `PlayerList` component with responsive grid (2-col mobile, multi-col desktop).
- [x] 4.2 Implement `getAvatar(playerId)` utility to return deterministic animal emoji.

- [x] 4.3 Implement "Start Game" button (Fixed bottom on mobile, standard on desktop).
- [x] 4.4 Implement "Join Game" modal/input (Ask for display name, save to Yjs Awareness).



## 5. Game State Initialization

- [x] 5.1 Implement Host logic to initialize `GameState` map (status: `LOBBY`) if empty.
- [x] 5.2 Implement Host logic to handle "Start Game" click (Update status to `PLAYING`).

