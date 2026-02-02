## 1. Fix Host Name Flow

- [x] 1.1 Update `hooks/useRoom.ts` to NOT set name during host claim (only set `isHost: true`)
- [x] 1.2 Update `app/room/[id]/page.tsx` to show modal for hosts without names
- [x] 1.3 Update `components/lobby/JoinGameModal.tsx` to preserve `isHost` flag when updating name
- [x] 1.4 Update `components/lobby/PlayerList.tsx` to show "(Host)" suffix for host when viewed by others
- [x] 1.5 Fix `isSynced` not triggering for solo rooms (first peer)
- [x] 1.6 Test room creator sees name modal and can enter custom name
- [x] 1.7 Test other players see host name with "(Host)" suffix
