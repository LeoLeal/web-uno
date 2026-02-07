## MODIFIED Requirements

### Requirement: Settings modal has House Rules section
The GameSettingsModal SHALL have a "House Rules" section with toggle switches for each rule modifier.

#### Scenario: Toggle switches for each rule
- **WHEN** the host views the House Rules section
- **THEN** they see toggle switches for: Draw Stacking, Jump-In, Zero Swap, Seven Swap, Force Play, Multiple Card Play
- **AND** each toggle shows current on/off state
- **AND** each toggle has an info tooltip explaining the rule
- **AND** the Draw Stacking toggle description explicitly says "No stacking" when disabled (OFF)
