## MODIFIED Requirements

### Requirement: Room page header layout

The system SHALL display the room header with game title, room code, connection status, mute toggle, and leave button.

#### Scenario: Header visible on desktop during gameplay

- **WHEN** the viewport is at or above the `md` breakpoint
- **THEN** the header is rendered inline at the top of the page (current behavior, unchanged)

#### Scenario: Header hidden on mobile during gameplay

- **WHEN** the game status is `PLAYING`, `PAUSED_WAITING_PLAYER`, `ROUND_ENDED`, or `ENDED`
- **AND** the viewport is below the `md` breakpoint
- **THEN** the header content is rendered inside the top `Drawer` component
- **AND** the header is NOT rendered inline on the page

#### Scenario: Header visible on mobile during lobby

- **WHEN** the game status is `LOBBY`
- **AND** the viewport is below the `md` breakpoint
- **THEN** the header is rendered inline at the top of the page (current behavior, unchanged)
