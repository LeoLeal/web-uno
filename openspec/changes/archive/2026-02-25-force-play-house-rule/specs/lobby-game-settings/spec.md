## MODIFIED Requirements

### Requirement: Settings modal has House Rules section

The GameSettingsModal SHALL have a "House Rules" section with toggle switches for each rule modifier, with unimplemented rules disabled.

#### Scenario: Toggle switches for each rule

- **WHEN** the host views the House Rules section
- **THEN** they see toggle switches for: Draw Stacking, Jump-In, Zero Swap, Seven Swap, Force Play, Multiple Card Play
- **AND** each toggle shows current on/off state
- **AND** each toggle has an info tooltip explaining the rule
- **AND** the Draw Stacking toggle description explicitly says "No stacking" when disabled (OFF)

#### Scenario: Unimplemented rules are disabled

- **WHEN** the host views the House Rules section
- **AND** a house rule is NOT in `IMPLEMENTED_RULES`
- **THEN** that rule's toggle switch SHALL be disabled (not interactive)
- **AND** the toggle SHALL display "Coming soon" label text
- **AND** the toggle SHALL be visually dimmed (via existing disabled CSS)

#### Scenario: Implemented rules are enabled

- **WHEN** the host views the House Rules section
- **AND** a house rule IS in `IMPLEMENTED_RULES`
- **THEN** that rule's toggle switch SHALL be fully interactive
- **AND** no "Coming soon" label is shown
