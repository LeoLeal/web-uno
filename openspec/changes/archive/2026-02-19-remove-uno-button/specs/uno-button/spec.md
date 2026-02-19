## REMOVED Requirements

### Requirement: UNO Button Visibility
**Reason**: The UNO button provides no functional gameplay effect and adds unnecessary UI noise.
**Migration**: Remove UNO button rendering and associated visibility/enablement logic from player-hand UI components.

### Requirement: UNO Button Appearance
**Reason**: Button-specific visual styling is no longer needed after removing the control.
**Migration**: Delete UNO button style classes/assets and any tests asserting UNO button appearance states.

### Requirement: UNO Button Interaction
**Reason**: Clicking the UNO button does not drive meaningful game-state behavior and should not be exposed.
**Migration**: Remove UNO button callbacks, props, and called-state wiring; keep gameplay flow independent of explicit UNO calls.

### Requirement: UNO Button Position
**Reason**: Positional requirements are obsolete once the UNO button is removed.
**Migration**: Simplify player-hand layout to exclude reserved UNO-button space.

### Requirement: UNO chat balloon on opponent avatars
**Reason**: This behavior remains valid but is not a button concern and must live with board rendering requirements.
**Migration**: Move this requirement to `game-board-ui` so opponent UNO balloon behavior remains specified after retiring `uno-button`.
