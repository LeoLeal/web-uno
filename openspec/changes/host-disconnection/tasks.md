## 1. Implement Host Disconnection Handling

- [x] 1.1 Update `hooks/useRoom.ts` to monitor host presence in awareness
- [x] 1.2 Add `isHostConnected` state and detection logic
- [x] 1.3 Create `HostDisconnectModal` component with countdown
- [x] 1.4 Update `app/room/[id]/page.tsx` to show modal when host disconnects
- [x] 1.5 Implement auto-redirect to home page after 5 second countdown
- [x] 1.6 Test: Host closes tab, other players see modal and redirect
- [x] 1.7 Test: Host refreshes, game ends gracefully for all
