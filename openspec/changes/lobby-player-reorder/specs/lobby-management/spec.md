## MODIFIED Requirements

### Requirement: Lobby Presence

The system SHALL display a list of all connected peers in the lobby, ordered by an explicit `playerOrder` array from Yjs shared state rather than alphabetically.

#### Scenario: User joins an existing lobby

- **WHEN** user navigates to `/room/[room-id]`
- **THEN** they are added to the synced player list
- **THEN** they see their own name and the names of other connected players
- **AND** the player list is ordered according to the `playerOrder` array in Yjs shared state

### Requirement: Responsive Lobby Layout

The system SHALL display the lobby interface effectively on both mobile and desktop viewports, using a flex-wrap layout for the player list.

#### Scenario: Mobile View

- **WHEN** the viewport width is < 768px (Mobile)
- **THEN** the player list renders using flex-wrap with card widths that result in approximately 3 cards per row
- **THEN** the "Start Game" button is fixed at the bottom of the screen (easy thumb access)
