## MODIFIED Requirements

### Requirement: Modal Theme Consistency
The system SHALL style all lobby modals (Join Game, Host Disconnect) with the Card Table aesthetic.

#### Scenario: Join Game modal appearance
- **WHEN** the Join Game modal is displayed
- **THEN** the modal background uses felt-toned colors
- **AND** the input uses .input-copper styling
- **AND** the submit button uses .btn-copper styling

#### Scenario: Host Disconnect modal appearance
- **WHEN** the Host Disconnect modal is displayed
- **THEN** the modal background uses felt-toned colors
- **AND** text uses cream color palette
- **AND** the modal container does NOT show a default browser focus ring/outline
