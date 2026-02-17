# Spec: Game Audio Feedback

## Purpose

Defines speech and sound feedback behavior for in-room gameplay events while preserving privacy boundaries and local player audio control.

## Requirements

### Requirement: Turn start speech cue
The system SHALL speak "Your turn!" using `SpeechSynthesisUtterance` when the local player turn transitions from not-current to current during active gameplay.

#### Scenario: Speak on local turn start transition
- **WHEN** game status is `PLAYING`
- **AND** `currentTurn` changes from a different player to the local player
- **THEN** the system speaks "Your turn!" once for that transition

#### Scenario: Do not repeat while turn remains unchanged
- **WHEN** game status is `PLAYING`
- **AND** the local player is already the current turn across subsequent renders/observations
- **THEN** the system does NOT speak "Your turn!" again until a new not-current to current transition occurs

### Requirement: Opponent UNO speech tied to opponent indicator
The system SHALL speak "Uno!" using `SpeechSynthesisUtterance` only when an opponent UNO indicator bubble appears in the opponents UI.

#### Scenario: Speak when opponent UNO bubble appears
- **WHEN** an opponent indicator transitions from not showing UNO to showing UNO (`cardCount` transition to `1`)
- **THEN** the system speaks "Uno!" once for that appearance transition

#### Scenario: Do not repeat while UNO bubble stays visible
- **WHEN** an opponent UNO bubble remains visible across subsequent renders/observations
- **THEN** the system does NOT repeatedly speak "Uno!"

#### Scenario: Do not use private hand state for UNO cue
- **WHEN** UNO speech logic is evaluated
- **THEN** the cue is derived from opponent-list UI signal (UNO bubble visibility/card count display)
- **AND** the local player does NOT read other players' private hand data to trigger the cue

### Requirement: Discard pile sound mapping
The system SHALL play a sound when a new card is added to the top of the discard pile, mapped by card symbol category.

#### Scenario: Number card discard sound
- **WHEN** top discard transitions to a new card
- **AND** the new top card symbol is a member of `NUMBER_SYMBOLS`
- **THEN** the system plays `public/sounds/play-card.wav`

#### Scenario: Action or wild discard sound
- **WHEN** top discard transitions to a new card
- **AND** the new top card symbol is a member of `ACTION_SYMBOLS` or `WILD_SYMBOLS`
- **THEN** the system plays `public/sounds/play-action-card.wav`

### Requirement: Draw action sound cue
The system SHALL play a draw sound when a draw action is successfully applied and card(s) are removed from the deck.

#### Scenario: Draw sound on successful draw effect
- **WHEN** a draw action outcome is observed in replicated gameplay state
- **THEN** the system plays `public/sounds/draw-card.mp3`

#### Scenario: Draw sound heard by all connected peers
- **WHEN** a draw action is successfully applied in a game room
- **THEN** each connected player client plays the draw cue locally from observed shared state changes

### Requirement: Game room mute control
The system SHALL provide a clickable mute icon in the game room header that toggles all game-room audio feedback for the local player.

#### Scenario: Default state is unmuted
- **WHEN** a player enters the game room
- **THEN** mute is disabled by default
- **AND** speech and sound cues are enabled

#### Scenario: Mute disables all audio cues
- **WHEN** the player enables mute from the header icon
- **THEN** the system does NOT play discard or draw sound clips
- **AND** the system does NOT speak "Your turn!" or "Uno!"

#### Scenario: Unmute re-enables all audio cues
- **WHEN** the player disables mute from the header icon
- **THEN** subsequent eligible speech and sound cues are played again

#### Scenario: Mute scope is local only
- **WHEN** one player toggles mute
- **THEN** only that player's client audio behavior changes
- **AND** no room-wide Yjs setting is written for mute state

### Requirement: Audio API failure tolerance
The system SHALL fail softly when browser audio or speech playback is unavailable or rejected.

#### Scenario: Speech API unavailable
- **WHEN** `SpeechSynthesisUtterance` or speech synthesis is unavailable in the runtime
- **THEN** gameplay continues without crashing
- **AND** speech cues are skipped

#### Scenario: Audio playback rejected
- **WHEN** clip playback is rejected by browser policy or runtime error
- **THEN** gameplay continues without crashing
- **AND** the failed playback does NOT block later game actions
