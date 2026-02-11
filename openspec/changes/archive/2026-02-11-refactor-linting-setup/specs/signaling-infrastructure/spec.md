## MODIFIED Requirements

### Requirement: Message Type Safety

The signaling server SHALL use typed message parsing (`{ type?: string; topics?: string[]; topic?: string }`) instead of `any` for incoming WebSocket messages.
