## 1. Audio feedback foundation

- [x] 1.1 Create a dedicated game-audio feedback hook/module for room-scoped speech and sound side effects
- [x] 1.2 Add audio utility wrappers for safe `SpeechSynthesisUtterance` and clip playback with fail-soft error handling
- [x] 1.3 Add transition-tracking primitives (previous turn, previous discard top, previous opponent UNO visibility) to prevent duplicate cues

## 2. Gameplay event cue wiring

- [x] 2.1 Implement "Your turn!" speech on local not-current -> current turn transition while status is `PLAYING`
- [x] 2.2 Implement discard cue mapping: `NUMBER_SYMBOLS` -> `play-card.wav`, `ACTION_SYMBOLS`/`WILD_SYMBOLS` -> `play-action-card.wav`
- [x] 2.3 Implement draw cue playback from successful draw outcomes observed in replicated state changes

## 3. Opponent UNO cue and privacy boundary

- [x] 3.1 Wire opponent UNO speech trigger to opponent indicator/UI bubble appearance transitions (`cardCount` transition to `1`)
- [x] 3.2 Ensure UNO speech does not repeatedly fire while bubble remains visible
- [x] 3.3 Verify UNO cue logic does not read private opponent hand data and relies only on opponent-list UI/card-count signals

## 4. Header mute control

- [x] 4.1 Add a clickable mute icon to the room header UI with clear muted/unmuted visual states
- [x] 4.2 Add local mute state with default unmuted on room entry
- [x] 4.3 Gate all room audio feedback (speech + sound clips) behind local mute state without writing room-wide Yjs mute data

## 5. Verification and tests

- [x] 5.1 Add unit tests for symbol-to-audio mapping and transition-detection guards
- [x] 5.2 Add component/integration tests for opponent UNO bubble appearance triggering one-time speech
- [x] 5.3 Add component/integration tests for header mute behavior (default unmuted, mute suppresses all cues, unmute restores cues)
- [x] 5.4 Add coverage for graceful handling when speech/audio APIs are unavailable or playback is rejected
