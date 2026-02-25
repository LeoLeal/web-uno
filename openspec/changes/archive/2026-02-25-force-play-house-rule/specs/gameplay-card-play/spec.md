## ADDED Requirements

### Requirement: Shared card playability function

The system SHALL provide a pure function `isCardPlayable(card, topDiscard)` in `lib/game/cards.ts` for determining if a card can be played against the current top discard card.

#### Scenario: Function used by host validation

- **WHEN** the host validates a `PLAY_CARD` action
- **THEN** it SHALL use `isCardPlayable` for the playability check

#### Scenario: Function used by client pre-validation

- **WHEN** the `useGamePlay` hook checks card playability
- **THEN** it SHALL use `isCardPlayable` for the playability check

### Requirement: Hand playability check function

The system SHALL provide a pure function `hasPlayableCard(hand, topDiscard)` that returns `true` if any card in the hand is playable.

#### Scenario: No playable cards

- **WHEN** `hasPlayableCard` is called with a hand containing no playable cards
- **THEN** it SHALL return `false`

#### Scenario: At least one playable card

- **WHEN** `hasPlayableCard` is called with a hand containing at least one playable card
- **THEN** it SHALL return `true`
