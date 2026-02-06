## ADDED Requirements

### Requirement: Info tooltip displays icon
The InfoTooltip component SHALL render an info icon that triggers the tooltip display.

#### Scenario: Info icon renders
- **WHEN** the InfoTooltip is rendered
- **THEN** an info icon is displayed
- **AND** the icon uses cream-dark color with reduced opacity

### Requirement: Info tooltip shows on hover (desktop)
The InfoTooltip component SHALL display the tooltip content when the icon is hovered on desktop devices.

#### Scenario: Hover shows tooltip
- **WHEN** the user hovers over the info icon with a mouse
- **THEN** the tooltip appears with the provided content
- **AND** the tooltip is positioned relative to the icon using CSS anchor positioning

#### Scenario: Mouse leave hides tooltip
- **WHEN** the tooltip is visible
- **AND** the user moves the mouse away from the icon
- **THEN** the tooltip disappears

### Requirement: Info tooltip shows on focus
The InfoTooltip component SHALL display the tooltip when the icon receives keyboard focus.

#### Scenario: Focus shows tooltip
- **WHEN** the info icon receives focus via keyboard navigation
- **THEN** the tooltip appears with the provided content

#### Scenario: Blur hides tooltip
- **WHEN** the tooltip is visible due to focus
- **AND** focus moves away from the info icon
- **THEN** the tooltip disappears

### Requirement: Info tooltip toggles on tap (mobile)
The InfoTooltip component SHALL toggle the tooltip visibility when tapped on touch devices.

#### Scenario: Tap shows tooltip
- **WHEN** the user taps the info icon on a touch device
- **AND** the tooltip is not visible
- **THEN** the tooltip appears

#### Scenario: Tap elsewhere hides tooltip
- **WHEN** the tooltip is visible on a touch device
- **AND** the user taps anywhere outside the tooltip and icon
- **THEN** the tooltip disappears

#### Scenario: Tap icon again hides tooltip
- **WHEN** the tooltip is visible on a touch device
- **AND** the user taps the info icon again
- **THEN** the tooltip disappears

### Requirement: Info tooltip uses CSS anchor positioning
The InfoTooltip component SHALL use CSS anchor positioning to position the tooltip relative to the icon with automatic viewport boundary handling.

#### Scenario: Tooltip anchored to icon
- **WHEN** the tooltip is visible
- **THEN** the tooltip is positioned using CSS `position-anchor` relative to the icon
- **AND** the tooltip appears above the icon by default

#### Scenario: Tooltip flips when near viewport edge
- **WHEN** the tooltip would overflow the viewport boundary
- **THEN** the tooltip repositions using `position-try-fallbacks` to remain visible

### Requirement: Info tooltip has themed styling
The InfoTooltip component SHALL display the tooltip with styling consistent with the panel-felt theme.

#### Scenario: Tooltip has panel styling
- **WHEN** the tooltip is visible
- **THEN** the tooltip has a dark semi-transparent background matching panel-felt
- **AND** the tooltip has a copper border
- **AND** the tooltip has rounded corners
- **AND** the text displays in cream color

### Requirement: Info tooltip is accessible
The InfoTooltip component SHALL provide accessible labeling for screen readers.

#### Scenario: Icon has accessible name
- **WHEN** the InfoTooltip is rendered
- **THEN** the icon button has an accessible label (e.g., "More information")

#### Scenario: Tooltip has tooltip role
- **WHEN** the tooltip is visible
- **THEN** the tooltip element has `role="tooltip"`

#### Scenario: Icon references tooltip
- **WHEN** the tooltip is visible
- **THEN** the icon has `aria-describedby` pointing to the tooltip
