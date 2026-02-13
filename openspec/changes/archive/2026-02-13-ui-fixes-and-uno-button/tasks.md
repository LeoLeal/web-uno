## 1. Room URL Fix

- [x] 1.1 Change `select-all` to `select-none` in room URL element (`app/room/[id]/page.tsx`)

## 2. Modal Consistency Fixes

- [x] 2.1 Update `WaitingForPlayerModal.tsx` - use `.panel-felt` class, `bg-black/40` backdrop
- [x] 2.2 Update `HostDisconnectModal.tsx` - use `.panel-felt` class, `bg-black/40` backdrop
- [x] 2.3 Update `JoinGameModal.tsx` - use `.panel-felt` class, `bg-black/40` backdrop
- [x] 2.4 Update `GameSettingsModal.tsx` - use `.panel-felt` class, `bg-black/40` backdrop
- [x] 2.5 Update `GameAlreadyStartedModal.tsx` - use `.panel-felt` class, `bg-black/40` backdrop, replace button with `btn-copper`
- [x] 2.6 Update `WinByWalkoverModal.tsx` - use `.panel-felt` class, `bg-black/40` backdrop, replace button with `btn-copper`

## 3. Opponent Indicator Updates

- [x] 3.1 Increase avatar size from `w-14 h-14` to `w-20 h-20` in `OpponentIndicator.tsx` (use responsive: `w-16 md:w-20`)
- [x] 3.2 Create `CardCountFan` component for displaying fanned card backs
- [x] 3.3 Replace inline card backs + text with `CardCountFan` in `OpponentIndicator.tsx`

## 4. UNO Button

- [x] 4.1 Create `UnoButton` component in `components/ui/UnoButton.tsx`
- [x] 4.2 Add `UnoButton` to `PlayerHand.tsx` above the card fan
- [x] 4.3 Add pulse animation when at 2 cards
- [x] 4.4 Add disabled state styling when > 2 cards
- [x] 4.5 Add click handler stub (verify `callUno` exists or create placeholder)
- [x] 4.6 Add tests for `UnoButton` component

## 5. Verification

- [x] 5.1 Run `npm run lint` - fix any issues
- [x] 5.2 Run `npm run test` - ensure all tests pass
- [x] 5.3 Manual testing - verify all modals look consistent
- [x] 5.4 Manual testing - verify game board layout with new opponent avatars and card fans
- [x] 5.5 Manual testing - verify UNO button visibility and disabled states
