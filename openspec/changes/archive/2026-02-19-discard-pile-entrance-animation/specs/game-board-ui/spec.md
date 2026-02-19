## ADDED Requirements

### Requirement: Track last played card provenance

The system SHALL track which player most recently played a card to enable provenance-based animations.

#### Scenario: Set lastPlayedBy on card play

- **WHEN** the host processes a valid `PLAY_CARD` action
- **THEN** the `lastPlayedBy` field in game state SHALL be set to the client ID of the player who played the card
- **AND** this value SHALL be synced to all connected clients via Yjs

#### Scenario: Initial lastPlayedBy value

- **WHEN** a new game or round is initialized
- **THEN** `lastPlayedBy` SHALL be `null` (the initial card is revealed, not played)

#### Scenario: Expose lastPlayedBy via hook

- **WHEN** a component calls `useGameState()`
- **THEN** the hook SHALL return `lastPlayedBy` as `number | null`

### Requirement: Discard pile entrance animation

The system SHALL animate newly played cards when they appear on the discard pile based on who played them.

#### Scenario: Opponent card entrance from top

- **WHEN** an opponent plays a card that becomes the new top card on the discard pile
- **THEN** the card animates entrance using the `enterFromTop` keyframe
- **AND** the animation starts with `opacity: 0` and `translateY(-30vh)`
- **AND** the opacity reaches `1` at 50% of the animation duration
- **AND** the card ends at its final transform position from `transformsById`
- **AND** the animation duration is 600ms with ease-out timing

#### Scenario: Current player card entrance from bottom

- **WHEN** the current player plays a card that becomes the new top card on the discard pile
- **THEN** the card animates entrance using the `enterFromBottom` keyframe
- **AND** the animation starts with `opacity: 1` and `translateY(40vh)`
- **AND** the card ends at its final transform position from `transformsById`
- **AND** the animation duration is 600ms with ease-out timing

#### Scenario: Previous cards remain static

- **WHEN** a new card is added to the discard pile
- **THEN** cards already in the visible discard pile do not animate
- **AND** only the top card (most recently played) receives the entrance animation

#### Scenario: No animation when lastPlayedBy is null

- **WHEN** the discard pile is displayed but `lastPlayedBy` is `null`
- **THEN** no entrance animation is applied to any card
- **AND** cards are displayed with their static transforms only

#### Scenario: Entrance rotation is random

- **WHEN** a card receives an entrance animation
- **THEN** the starting rotation is a random value between -420° and 420°
- **AND** the rotation value is set via CSS variable `--entrance-rotation-start`
- **AND** the final rotation uses the value from `transformsById` via CSS variable `--final-rotation`

#### Scenario: Final position uses existing transforms

- **WHEN** a card receives an entrance animation
- **THEN** the final `translateX` and `translateY` values use the offsets from `transformsById`
- **AND** the values are set via CSS variables `--final-offset-x` and `--final-offset-y`
