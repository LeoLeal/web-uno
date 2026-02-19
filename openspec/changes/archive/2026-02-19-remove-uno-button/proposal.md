## Why

The UNO button currently appears on the board but is not connected to any meaningful game outcome, which adds UI noise and player confusion. Removing it now reduces maintenance overhead and keeps the game surface aligned with implemented behavior.

## What Changes

- Remove the UNO button from in-game board UI so players are no longer prompted to use a non-functional control.
- Remove related UNO-button-only wiring, props, and dead paths that exist only to support this unused control.
- Update test coverage and documentation references so they no longer expect UNO button behavior.

## Capabilities

### New Capabilities
- (none)

### Modified Capabilities
- `uno-button`: Retire this capability entirely by removing its requirements and references from active specs.
- `game-board-ui`: Add the opponent UNO chat balloon requirement here so it remains specified after retiring `uno-button`.

## Impact

- Affected code: gameplay UI components (player hand/board controls), related hooks or props, and UNO-button-specific tests.
- APIs/protocols: no network protocol or external API changes expected.
- Dependencies/systems: no new dependencies; cleanup is confined to existing frontend/runtime code paths and tests.
