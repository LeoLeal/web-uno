## Why

The game currently provides only visual feedback for turn changes and card actions, which can be easy to miss during fast-paced play or on mobile. Adding lightweight voice and sound cues improves turn awareness and action clarity for all peers without exposing private hand data.

## What Changes

- Add spoken "Your turn!" feedback using `SpeechSynthesisUtterance` when the local player's turn begins.
- Add spoken "Uno!" feedback using `SpeechSynthesisUtterance` when an opponent UNO indicator becomes visible in the opponents UI (based on opponent card count display, not private hand inspection).
- Add discard sound effects when a new top discard card appears:
- Play `public/sounds/play-card.wav` for number symbols in `NUMBER_SYMBOLS`.
- Play `public/sounds/play-action-card.wav` for symbols in `ACTION_SYMBOLS` or `WILD_SYMBOLS`.
- Add draw sound effect `public/sounds/draw-card.mp3` when a draw action removes a card from the deck.
- Ensure gameplay sounds are heard by all players through local playback triggered from shared game events.
- Add a local mute toggle icon in the game room header that disables/enables all room audio feedback for that player (default: unmuted).

## Capabilities

### New Capabilities
- `game-audio-feedback`: Speech and sound cue behavior for turn start, UNO UI indicator, discard events, and draw events.

### Modified Capabilities
- None.

## Impact

- Affected UI/components: game board and opponent indicators where cues are surfaced.
- Affected gameplay observation hooks/state listeners: turn, discard, and draw event detection paths.
- Affected assets: existing sound files under `public/sounds/` (`play-card.wav`, `play-action-card.wav`, `draw-card.mp3`).
- No protocol, API, or P2P data model changes; behavior is derived from existing replicated state and UI-visible card counts.
