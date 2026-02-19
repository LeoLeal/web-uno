## ADDED Requirements

### Requirement: Opponent UNO chat balloon

The system SHALL display a "UNO!" chat balloon on opponent avatars when they have exactly 1 card.

#### Scenario: Balloon appears at 1 card
- **WHEN** an opponent's card count is exactly 1
- **THEN** a "UNO!" mini chat balloon is displayed near their avatar
- **AND** the balloon is always visible (not hover-triggered)

#### Scenario: Balloon disappears when card count changes
- **WHEN** an opponent's card count changes from 1 to any other number
- **THEN** the "UNO!" chat balloon is removed

#### Scenario: Balloon positioning with CSS anchor
- **WHEN** the "UNO!" balloon is displayed
- **THEN** the opponent's avatar element has a CSS `anchor-name` property
- **AND** the balloon element uses `position-anchor` to anchor to the avatar
- **AND** the balloon is positioned above and to the right of the avatar

#### Scenario: Balloon fallback positioning
- **WHEN** the browser does not support CSS anchor positioning
- **THEN** the balloon is positioned using `position: absolute` relative to the avatar container
- **AND** the balloon appears above and to the right of the avatar

#### Scenario: Balloon styling
- **WHEN** the "UNO!" balloon is displayed
- **THEN** it has a speech bubble appearance with a small tail/pointer
- **AND** it uses a contrasting background color for visibility
- **AND** the text is bold and compact
