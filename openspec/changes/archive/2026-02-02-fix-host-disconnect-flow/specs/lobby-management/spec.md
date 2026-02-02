## MODIFIED Requirements

### Requirement: Host Disconnection Navigation
The system SHALL smoothly navigate players to home page when host disconnects, without causing React/Next.js errors.

#### Scenario: Smooth navigation after countdown
- **WHEN** the countdown reaches 0
- **THEN** the system clears all timers
- **THEN** the system navigates to home page
- **THEN** no React rendering errors occur

#### Scenario: No race conditions
- **WHEN** the modal is counting down
- **THEN** state updates happen separately from navigation
- **THEN** navigation only triggers once when countdown hits 0
