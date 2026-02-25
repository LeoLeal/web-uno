## ADDED Requirements

### Requirement: Force Play draw validation

The system SHALL reject `DRAW_CARD` actions when the Force Play house rule is enabled and the player has a playable card.

#### Scenario: Draw rejected when playable card exists

- **WHEN** the host receives a `DRAW_CARD` action
- **AND** the Force Play setting is enabled
- **AND** the player's hand contains at least one playable card
- **THEN** the host SHALL reject the action (clear from `actionsMap`)
- **AND** no game state changes occur

#### Scenario: Draw allowed when no playable card exists

- **WHEN** the host receives a `DRAW_CARD` action
- **AND** the Force Play setting is enabled
- **AND** the player's hand contains no playable cards
- **THEN** the host SHALL execute the draw normally

#### Scenario: Draw unaffected when Force Play is disabled

- **WHEN** the host receives a `DRAW_CARD` action
- **AND** the Force Play setting is disabled (default)
- **THEN** the host SHALL execute the draw normally regardless of hand contents

### Requirement: Client-side draw availability

The `useGamePlay` hook SHALL expose a `canDraw` boolean reflecting whether the current player is allowed to draw.

#### Scenario: canDraw when Force Play disabled

- **WHEN** the Force Play setting is disabled
- **THEN** `canDraw` SHALL be `true`

#### Scenario: canDraw when Force Play enabled and no playable card

- **WHEN** the Force Play setting is enabled
- **AND** the player's hand has no playable cards
- **THEN** `canDraw` SHALL be `true`

#### Scenario: canDraw when Force Play enabled and playable card exists

- **WHEN** the Force Play setting is enabled
- **AND** the player's hand has at least one playable card
- **THEN** `canDraw` SHALL be `false`
