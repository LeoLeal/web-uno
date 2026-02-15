## REMOVED Requirements

### Requirement: Skip card two-player behavior

**Reason**: With MIN_PLAYERS set to 3, two-player games are no longer possible. This scenario described special behavior that only applied in 2-player mode.

**Migration**: Not applicable - this scenario is unreachable with current player limits.

#### Scenario: Skip in two-player game (REMOVED)

- **WHEN** a player plays a Skip card in a two-player game
- **THEN** the playing player effectively gets another turn

### Requirement: Reverse card two-player behavior

**Reason**: With MIN_PLAYERS set to 3, two-player games are no longer possible. This scenario described special behavior that only applied in 2-player mode.

**Migration**: Not applicable - this scenario is unreachable with current player limits.

#### Scenario: Reverse in two-player game (REMOVED)

- **WHEN** a player plays a Reverse card in a two-player game
- **THEN** the Reverse acts as a Skip (the playing player effectively gets another turn)
- **AND** the direction still flips

## MODIFIED Requirements

### Requirement: Skip card effect on turns

The system SHALL skip the next player's turn when a Skip card is played.

#### Scenario: Skip advances past next player

- **WHEN** a player plays a Skip card
- **THEN** the turn advances past the next player in the current direction
- **AND** the skipped player does not get to act

### Requirement: Reverse card effect on turns

The system SHALL reverse the play direction when a Reverse card is played.

#### Scenario: Reverse changes direction

- **WHEN** a player plays a Reverse card
- **THEN** the direction changes from `1` to `-1` or from `-1` to `1`
- **AND** the turn advances one position in the new direction
