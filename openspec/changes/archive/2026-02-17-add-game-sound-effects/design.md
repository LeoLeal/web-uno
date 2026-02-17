## Context

The game is a host-authoritative P2P Uno app where gameplay state is replicated through Yjs and rendered locally by each client. The requested audio behavior mixes two signal types:
- gameplay-derived signals observed from shared state (turn transitions, discard top-card changes, draw actions), and
- UI-derived signals in opponent presentation (`UNO!` bubble) to preserve privacy boundaries (no direct reading of other players' hand contents).

Constraints:
- Audio must be local playback on each peer (no new network protocol).
- Opponent UNO speech must be tied to opponents list behavior, not private hand inspection logic.
- Browser APIs are `SpeechSynthesisUtterance` and HTMLAudioElement-based clip playback.

## Goals / Non-Goals

**Goals:**
- Provide deterministic, event-driven audio cues for core gameplay moments:
  - Speak "Your turn!" when local turn starts.
  - Speak "Uno!" when an opponent UNO bubble appears.
  - Play discard clip based on card-symbol category.
  - Play draw clip when draw action removes card(s) from deck.
- Keep behavior privacy-safe by deriving UNO speech from opponent card-count UI state.
- Ensure all players hear shared gameplay clips via local observers on replicated state.
- Prevent repeated/redundant cue spam via transition-based detection.

**Non-Goals:**
- No room-wide audio settings protocol or host-controlled volume policy.
- No new gameplay rules or changes to turn/card validation semantics.
- No attempt to guarantee identical speech voice/timing across browsers.

## Decisions

### 1) Add a dedicated client-side audio feedback layer
Create a focused audio-feedback hook/module consumed by game view components. It observes existing state/hooks and triggers speech/sound side effects.

Rationale:
- Keeps audio concerns separate from game-engine mutation logic.
- Preserves current host-authoritative state flow.
- Minimizes risk of introducing logic coupling into `useGameEngine`.

Alternatives considered:
- Trigger sounds directly inside host action processing (`useGameEngine`): rejected because it only executes on host and would not naturally play on all peers.
- Trigger from multiple scattered components: rejected due to duplicated logic and higher risk of inconsistent cue behavior.

### 2) Use transition-based event detection with refs
Track previous values (e.g., prior `currentTurn`, prior top discard card id, prior opponent UNO visibility) and trigger cues only on meaningful transitions.

Rationale:
- Avoids replay on re-render/re-observe cycles.
- Aligns with Yjs observer patterns where state snapshots can update frequently.

Alternatives considered:
- Stateless checks (`if isMyTurn then speak`): rejected due to repeated speech each render.

### 3) Bind UNO speech to Opponent UI state
UNO speech event source is opponent indicator visibility (`cardCount === 1` for opponents), not direct hand reads.

Rationale:
- Explicitly honors privacy requirement.
- Aligns audible cue with what the player visually sees (UNO bubble appearance).

Alternatives considered:
- Infer UNO from `dealtHands` or raw hand arrays: rejected because it relies on private-hand-oriented structures and violates requested boundary.

### 4) Symbol-category mapping for discard clips
When top discard changes:
- `NUMBER_SYMBOLS` -> `play-card.wav`
- `ACTION_SYMBOLS` or `WILD_SYMBOLS` -> `play-action-card.wav`

Rationale:
- Uses canonical card-symbol constants in `lib/game/cards.ts`.
- Keeps mapping stable and spec-friendly.

Alternatives considered:
- Per-symbol unique clips: out of scope for initial change.

### 5) Draw cue from draw-action processing effects
Draw audio should play on transitions reflecting draw action effects (card added to hand/card count increase due to draw), tied to authoritative action outcomes observed in shared state.

Rationale:
- Sound represents completed game outcome, not merely intent submission.
- Works for all peers observing replicated result.

Alternatives considered:
- Trigger on local submit (`submitAction`): rejected since invalid/rejected actions could still produce sound.

### 6) Speech and audio safeguards
Implement lightweight safeguards:
- Ignore speech when Web Speech API unavailable.
- Cancel/replace overlapping short utterances as needed.
- Fail-soft clip playback (catch promise rejection/autoplay errors without breaking gameplay).
- Do not auto-mute cues based on tab visibility; cues remain enabled unless the user explicitly mutes.

Rationale:
- Cross-browser reliability without affecting core game function.

### 7) Add a room-header mute control (local)
Add a clickable mute icon in the game room header that toggles all room audio feedback (speech + sound clips) on/off for the local player only.

Behavior:
- Default initial state: unmuted (all audio feedback enabled).
- When muted: no "Your turn!" speech, no "Uno!" speech, and no card/draw sound playback.
- Scope: game room only; no shared Yjs setting or host-controlled mute state.

Rationale:
- Satisfies accessibility/control needs without introducing protocol or game-rule changes.
- Keeps privacy and ownership simple by making mute preference local.

## Risks / Trade-offs

- [Autoplay and speech permission variance across browsers] -> Mitigation: best-effort playback/speech, graceful failure, optional first-gesture unlock handling in UI lifecycle.
- [Duplicate cues from rapid state updates] -> Mitigation: strict prev->next transition checks keyed by stable identifiers.
- [Cue fatigue in fast rounds] -> Mitigation: debounce/cooldown windows per cue category if needed.
- [Event-source ambiguity for draw detection] -> Mitigation: define one authoritative observable condition in specs and cover with tests.

## Migration Plan

1. Add new `game-audio-feedback` capability spec.
2. Implement audio-feedback observer layer and wire into room/game UI.
3. Verify behavior in multiplayer sessions (host + guests) for all cue types.
4. Add/adjust automated tests for transition detection and mapping logic.

Rollback strategy:
- Revert wiring to disable new side effects; gameplay state model and protocol remain unchanged.

## Open Questions

- None currently. Prior questions were resolved with these decisions:
- Do not auto-mute by visibility state.
- Trigger "Uno!" speech only on opponent UNO bubble appearance transitions (not while continuously displayed).
- Include a local header mute icon in this change; default is unmuted.
