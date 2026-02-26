## Why

The game UI has three friction points that reduce clarity and polish: inconsistent branding typography between home and room screens, mobile chat submission that closes the drawer but leaves the virtual keyboard open, and score-limit options that do not clearly represent single-round versus endless multi-round play. Addressing these together improves UX consistency and makes game mode intent explicit.

## What Changes

- Update home logo typography to use the same Nunito style as the room header for consistent brand presentation.
- Adjust mobile in-game chat submit behavior so sending from the drawer both closes the drawer and dismisses the virtual keyboard.
- Revise score limit options and semantics:
  - Replace the current `∞` option label (currently interpreted as single-round) with explicit `Single Round`.
  - Add a new explicit `∞`/`Infinite` option that means endless multi-round play with cumulative scoring and no automatic match end.
- Update settings summaries/tooltips and gameplay end-condition behavior so the new score mode semantics are reflected in UI and engine logic.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `homepage-design`: Change home logo typography requirement from Playfair Display to Nunito for the text mark.
- `room-chat`: Extend mobile drawer send behavior to require virtual keyboard dismissal after message submission.
- `game-settings`: Expand score limit options so single-round is explicit and infinite is a numeric endless option.
- `lobby-game-settings`: Update score option labels and settings copy to distinguish `Single Round` from `Infinite`.
- `scoring`: Preserve cumulative scoring in endless mode without end-threshold termination.
- `gameplay-win-condition`: Update win-state transitions so endless mode enters `ROUND_ENDED` and never transitions to `ENDED` from score threshold.

## Impact

- Affected UI/components: `components/ui/Logo.tsx`, `components/game/ChatInput.tsx`, `app/room/page.tsx`, settings modal/panel components.
- Affected game state/settings: `lib/game/settings.ts`, `hooks/useGameSettings.ts`.
- Affected host engine logic: `hooks/useGameEngine.ts` score-limit and end-condition branching.
- Affected tests/spec alignment: settings, room chat mobile behavior, scoring and win-condition test coverage and OpenSpec capability deltas.
