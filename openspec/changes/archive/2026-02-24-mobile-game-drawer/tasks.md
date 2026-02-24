## 1. Drawer Component

- [x] 1.1 Create `components/ui/Drawer.tsx` with `DrawerProps` interface (`isOpen`, `onOpenChange`, `children`, `className`)
- [x] 1.2 Implement collapsed/expanded states using `transform: translateY()` with CSS transition (300ms ease-out)
- [x] 1.3 Render drag handle at the bottom edge of the drawer panel
- [x] 1.4 Implement tap-to-toggle on handle click (toggle `onOpenChange`)
- [x] 1.5 Implement full drag gesture via `onPointerDown/Move/Up` with velocity-based snapping (>30% height or fast swipe)
- [x] 1.6 Prevent tap firing when drag distance exceeds 5px threshold
- [x] 1.7 Disable CSS transition during active drag, re-enable on release
- [x] 1.8 Add `Drawer.module.css` for handle styling and transition classes
- [x] 1.9 Apply `md:hidden` so Drawer is only visible below the `md` breakpoint
- [x] 1.10 Write unit tests for Drawer component (tap toggle, render children, collapsed/expanded states)

## 2. Chat Pop Sound

- [x] 2.1 Add `isMuted` parameter to `useChatNetwork` hook
- [x] 2.2 Play `/sounds/chat-pop.mp3` via `playSound()` in `handleMessage` when `msg.clientId !== gameClientId` and `!isMuted`
- [x] 2.3 Update `useChatNetwork` call site in `app/room/page.tsx` to pass `isMuted`
- [x] 2.4 Write unit test for chat-pop sound behavior (plays on incoming, not on own, respects mute)

## 3. Mobile Game Layout Integration

- [x] 3.1 Extract header JSX from `app/room/page.tsx` into a reusable fragment or section
- [x] 3.2 Add `isDrawerOpen` state and `Drawer` component to `RoomPageContent` (mobile only, gameplay states only)
- [x] 3.3 Render header + `ChatInput` inside `Drawer` on mobile during gameplay (`PLAYING`/`PAUSED_WAITING_PLAYER`)
- [x] 3.4 Render header inline on desktop (unchanged) using `hidden md:flex`
- [x] 3.5 Remove `onSendMessage` from `PlayerHand` on mobile during gameplay (keep on desktop)
- [x] 3.6 Implement auto-retract: wrap `sendMessage` to also call `setDrawerOpen(false)` when sending from drawer
- [x] 3.7 Ensure lobby layout remains unchanged on all breakpoints

## 4. Verification

- [x] 4.1 Run existing test suite (`npm test`) and confirm no regressions
- [x] 4.2 Manual test on mobile viewport: drawer collapses/expands, chat input works, auto-retracts on send
- [x] 4.3 Manual test on desktop viewport: layout unchanged, ChatInput still above PlayerHand
- [x] 4.4 Manual test chat-pop sound plays on incoming messages and respects mute toggle
- [x] 4.5 Run lint check (`npm run lint`)
