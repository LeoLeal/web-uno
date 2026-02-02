## Context

The current flow automatically assigns "Host" as the name when claiming host status. This prevents the JoinGameModal from appearing for room creators since it checks if the user has a name.

## Goals / Non-Goals

**Goals:**
- Room creators see the name input modal like everyone else
- Hosts choose their own display name
- Other players can identify who the host is via "(Host)" suffix
- Preserve existing crown icon for host

**Non-Goals:**
- Changing the host detection algorithm
- Adding host migration features

## Decisions

### Host Name Flow
- **Decision**: Set `isHost: true` but leave name empty during host claim
- **Modal Trigger**: Show modal if `!user.name` regardless of host status
- **Name Update**: When host enters name, preserve `isHost: true` flag
- **Display**: Show "PlayerName (Host)" for non-hosts viewing host, just "PlayerName" for self

### Display Logic
- **Decision**: 
  - Self view: Just show name + "You" badge + Crown
  - Others view: Show name + "(Host)" suffix + Crown
- **Implementation**: Check `player.isHost` and viewer perspective

## Risks / Trade-offs

- **Empty Host State**: Brief period where host has no name
  - *Mitigation*: Acceptable, modal appears immediately
