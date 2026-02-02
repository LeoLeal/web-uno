## Why

Room creators are currently forced to be called "Host" without being asked for their name. This creates a poor user experience where the person creating the room doesn't get to personalize their identity. The modal that asks for names should appear for everyone, including the host.

## What Changes

- Modify host claim logic to NOT automatically set name to "Host"
- Keep `isHost: true` flag but allow user to choose their name
- Update JoinGameModal to appear for hosts (check `isHost` flag instead of name presence)
- Update PlayerList component to show "(Host)" suffix for the host player when viewed by others
- Room creator flow: Create room → See modal → Enter name → Become "PlayerName (Host)"

## Capabilities

### Modified Capabilities
- `lobby-management`: Update name input flow to include hosts
- `p2p-networking`: Update host detection to not pre-set name

## Impact

- Update to `hooks/useRoom.ts` host claim logic
- Update to `components/lobby/JoinGameModal.tsx` trigger condition
- Update to `components/lobby/PlayerList.tsx` display format
