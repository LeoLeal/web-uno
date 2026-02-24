## Context

On mobile devices during gameplay, the header (title, room code, sync status, mute/leave) and the floating `ChatInput` above `PlayerHand` consume ~120px of vertical space that would be better used for cards and the table center. Desktop layout is fine and should not change.

Currently:

- Header is rendered inline in `app/room/page.tsx` (lines 136–171)
- `ChatInput` is rendered inside `PlayerHand` as an absolutely-positioned element at `bottom-[220px]`
- `useChatNetwork` handles message transport; `useGameAudioFeedback` handles game sounds via `playSound()`

## Goals / Non-Goals

**Goals:**

- Reclaim vertical space on mobile during gameplay by hiding header + chat input in a retractable top drawer
- Create a generic, reusable `Drawer` component (not game-specific)
- Support full touch-drag gesture with spring-like snapping, plus tap-to-toggle
- Auto-retract drawer after sending a chat message on mobile
- Play `chat-pop.mp3` on incoming messages from other players (respecting mute)

**Non-Goals:**

- Changing desktop layout (stays identical)
- Changing lobby layout (header and chat input remain as-is)
- Persisting chat messages or adding message history UI in the drawer
- Adding unread message indicators on the drawer handle

## Decisions

### 1. Generic `Drawer` component at `components/ui/Drawer.tsx`

The component accepts `children`, an `isOpen` controlled state, and an `onOpenChange` callback. It uses `transform: translateY()` to slide content. The handle is always at the bottom edge of the drawer panel.

**Why generic**: Avoids coupling UI primitives to game logic. Could be reused for settings panels, help overlays, etc.

**API shape:**

```tsx
interface DrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}
```

### 2. Touch gesture via pointer events

Use `onPointerDown/Move/Up` (not `onTouchStart/Move/End`) for unified mouse + touch handling. Track drag delta from the handle, snap open/closed based on velocity and distance threshold (>30% of drawer height or fast swipe). Use CSS `transition` for animated snapping, disabled during active drag via inline `transform`.

**Why pointer events**: Works on both touch and mouse. No need for a gesture library.

### 3. Responsive conditional rendering in `page.tsx`

Use a `useMediaQuery` hook (or Tailwind `md:hidden`/`md:block` classes) to conditionally render:

- **Mobile + playing**: Header + ChatInput inside `<Drawer>`, `PlayerHand` without `onSendMessage`
- **Desktop or lobby**: Header inline as today, ChatInput in `PlayerHand`

**Why CSS classes over JS**: Simpler, no hydration mismatch risk, follows existing Tailwind patterns. The Drawer wrapper renders always but is `md:hidden`. Desktop header stays in the normal flow with `hidden md:flex`.

### 4. Chat pop sound in `useChatNetwork`

Add a `playSound('/sounds/chat-pop.mp3')` call in the `handleMessage` callback when `msg.clientId !== gameClientId` (not our own message). Thread `isMuted` into the hook.

**Why in the hook**: Sound is a reaction to incoming messages, not UI state. Keeps it consistent regardless of which screen is active.

### 5. Auto-retract via callback composition

The game page wraps `sendMessage` to also close the drawer:

```tsx
const handleSendFromDrawer = (text: string) => {
  sendMessage(text);
  setDrawerOpen(false);
};
```

No need for the Drawer to know about chat.

## Risks / Trade-offs

- **Keyboard interaction on mobile**: When the ChatInput inside the drawer gets focus, the virtual keyboard will push content up. The drawer should remain open during typing — auto-retract only happens after send, not on blur.
- **Drawer height**: Content height varies (header is ~80px, chat input is ~56px). The drawer should measure its content height dynamically or use a fixed max-height with overflow hidden.
- **Performance**: CSS transitions on `transform` are GPU-accelerated and should be smooth. During drag, we set `transition: none` and use `requestAnimationFrame` for position updates.
