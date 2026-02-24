## Why

During gameplay on mobile, the header (title, room code, sync status, mute/leave buttons) and the floating ChatInput consume significant vertical space, reducing the area available for the game board, table center, and player hand. The header information is rarely needed mid-game, and the chat input competes with card interaction. Consolidating these into a retractable top drawer reclaims screen real estate while keeping functionality accessible on demand.

## What Changes

- Introduce a generic `Drawer` UI component that slides down from the top of the screen with a drag handle at its bottom edge. Supports full touch-drag gestures and tap-to-toggle.
- On mobile (`< md` breakpoint) during gameplay, the header and in-game chat input move into the `Drawer`, hidden by default.
- The `ChatInput` is removed from `PlayerHand` on mobile during gameplay (it lives in the drawer instead). Desktop layout remains unchanged.
- After sending a chat message via the drawer, it auto-retracts.
- Play `chat-pop.mp3` sound when a new chat message arrives from another player, respecting the existing mute toggle.

## Capabilities

### New Capabilities

- `ui-drawer`: A generic, reusable top-edge drawer component with drag-gesture and tap-to-toggle support. Contains a drag handle at the bottom, slides content down/up with spring-like snapping.

### Modified Capabilities

- `room-chat`: Add chat-pop sound on incoming messages (gated by mute). Auto-retract drawer on message send (mobile only).
- `game-board-ui`: On mobile during gameplay, header and ChatInput move into the drawer; ChatInput removed from PlayerHand on mobile.

## Impact

- **New component**: `components/ui/Drawer.tsx` + CSS module
- **Modified**: `app/room/page.tsx` — conditional rendering of header content into Drawer on mobile during gameplay
- **Modified**: `components/game/PlayerHand.tsx` — remove ChatInput on mobile during gameplay (moved to drawer)
- **Modified**: `hooks/useChatNetwork.ts` — play `chat-pop.mp3` on incoming messages from others, gated by `isMuted`
- **Audio asset**: `public/sounds/chat-pop.mp3` (already exists)
