## ADDED Requirements

### Requirement: Single Command Startup
The development environment SHALL be startable with a single command that launches all necessary services.

#### Scenario: Running dev command
- **WHEN** a developer runs `npm run dev`
- **THEN** the Next.js application server starts
- **THEN** the Signaling server starts
- **THEN** output from both services is streamed to the console
