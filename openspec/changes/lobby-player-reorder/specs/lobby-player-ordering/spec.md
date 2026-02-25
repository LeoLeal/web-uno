## ADDED Requirements

### Requirement: Player Order State

The system SHALL maintain an explicit `playerOrder` array (`number[]` of clientIds) in Yjs shared state (`gameState` map) to track the ordering of players in the lobby. This ordering determines turn order when the game starts.

#### Scenario: Initial player order

- **WHEN** the host creates a room and joins
- **THEN** the `playerOrder` array is initialized with the host's clientId as the first entry

#### Scenario: New player joins

- **WHEN** a new player joins the lobby
- **AND** their clientId is NOT already in the `playerOrder` array
- **THEN** the host SHALL append their clientId to the end of `playerOrder`

#### Scenario: Player reconnects

- **WHEN** a player's awareness reconnects in the lobby
- **AND** their clientId already exists in the `playerOrder` array
- **THEN** their position in `playerOrder` SHALL NOT change

#### Scenario: Player leaves

- **WHEN** a player's awareness is removed during the lobby phase
- **AND** their clientId exists in the `playerOrder` array
- **THEN** the host SHALL remove their clientId from `playerOrder`
- **AND** the remaining players' relative order SHALL be preserved

### Requirement: Player List Display Order

The system SHALL display players in the lobby PlayerList component ordered by the `playerOrder` array, replacing the previous alphabetical sort.

#### Scenario: Lobby player list ordering

- **WHEN** the lobby PlayerList is rendered
- **THEN** players SHALL appear in the order defined by `playerOrder`

### Requirement: Host Drag-and-Drop Reorder

The system SHALL allow the host to reorder players in the lobby by dragging player cards via a grip handle.

#### Scenario: Drag handle visibility

- **WHEN** the host views the lobby PlayerList
- **THEN** each player card SHALL display a small grip handle icon (⋮⋮, `GripVertical`) at the top-right corner of the card
- **AND** the handle SHALL NOT increase the current card dimensions

#### Scenario: Non-host handle visibility

- **WHEN** a non-host player views the lobby PlayerList
- **THEN** no drag handles SHALL be visible

#### Scenario: Host drags a player card

- **WHEN** the host initiates a drag on a player card's grip handle
- **AND** drops the card at a new position
- **THEN** the `playerOrder` array in Yjs SHALL be updated to reflect the new order
- **AND** all connected peers SHALL see the updated order

#### Scenario: Touch device drag

- **WHEN** the host uses a touch device to drag a player card via the grip handle
- **THEN** the drag interaction SHALL be confined to the handle element
- **AND** scrolling the page by touching anywhere outside the handle SHALL work normally

### Requirement: Randomize Player Order

The system SHALL provide the host with a button to randomize the player order in the lobby.

#### Scenario: Randomize button display

- **WHEN** the host views the lobby
- **THEN** a button with a shuffle icon and the label "Randomize player order" SHALL appear next to the player count in the lobby header

#### Scenario: Non-host randomize button

- **WHEN** a non-host player views the lobby
- **THEN** the randomize button SHALL NOT be visible

#### Scenario: Host clicks randomize

- **WHEN** the host clicks the "Randomize player order" button
- **THEN** the `playerOrder` array in Yjs SHALL be shuffled randomly
- **AND** all connected peers SHALL see the new randomized order

### Requirement: Player Order to Turn Order

The system SHALL use the `playerOrder` array as the basis for `turnOrder` when the game starts.

#### Scenario: Game start sets turn order from player order

- **WHEN** the host clicks "Start Game"
- **THEN** the `turnOrder` SHALL be set from the current `playerOrder`
- **AND** the first player in `turnOrder` SHALL be the first to play (subject to first-card effects)

### Requirement: PlayerList Flex-Wrap Layout

The system SHALL render the lobby PlayerList using a flex-wrap layout instead of CSS grid to support drag-and-drop reordering.

#### Scenario: PlayerList layout

- **WHEN** the lobby PlayerList is rendered
- **THEN** player cards SHALL be displayed in a flex container with flex-wrap behavior
- **AND** the visual appearance SHALL resemble the current responsive grid layout (approximately 3 columns on mobile, 4 on tablet, 5 on desktop)
