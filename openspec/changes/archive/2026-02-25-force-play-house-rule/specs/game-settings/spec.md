## ADDED Requirements

### Requirement: Implemented rules registry

The system SHALL maintain an `IMPLEMENTED_RULES` set listing house rule keys that have engine-side implementations.

#### Scenario: Registry contains only implemented rules

- **WHEN** `IMPLEMENTED_RULES` is accessed
- **THEN** it SHALL contain only house rule keys with functional engine support
- **AND** it SHALL currently contain `forcePlay`

#### Scenario: Registry is extensible

- **WHEN** a new house rule is implemented in the engine
- **THEN** its key SHALL be added to `IMPLEMENTED_RULES`
- **AND** no component changes are required to enable its toggle
