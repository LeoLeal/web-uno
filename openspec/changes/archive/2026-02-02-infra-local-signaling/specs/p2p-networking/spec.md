## MODIFIED Requirements

### Requirement: Yjs Provider Initialization
The system SHALL initialize a `y-webrtc` provider using the Room ID as the signaling channel and the configured signaling URL.

#### Scenario: Provider connection
- **WHEN** the room component mounts
- **THEN** a `WebrtcProvider` is instantiated with the Room ID
- **THEN** the provider connects to the URL specified in `NEXT_PUBLIC_SIGNALING_URL` (defaulting to `ws://localhost:4444`)
