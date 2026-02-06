## ADDED Requirements

### Requirement: Pill button group displays options
The PillButtonGroup component SHALL display a horizontal group of pill-shaped buttons for each option provided.

#### Scenario: Options render as buttons
- **WHEN** the PillButtonGroup is rendered with an array of options
- **THEN** each option renders as a pill-shaped button
- **AND** buttons display the option labels

### Requirement: Pill button group indicates selection
The PillButtonGroup component SHALL visually distinguish the selected option from unselected options.

#### Scenario: Selected option styling
- **WHEN** an option's value matches the current value prop
- **THEN** that button displays with copper gradient background
- **AND** the button has a warm glow effect
- **AND** the text displays in cream color

#### Scenario: Unselected option styling
- **WHEN** an option's value does not match the current value prop
- **THEN** that button displays with transparent or subtle background
- **AND** the button has a copper border
- **AND** the text displays in cream-dark color

### Requirement: Pill button group handles selection
The PillButtonGroup component SHALL invoke the onChange callback when the user selects an option.

#### Scenario: Clicking option triggers change
- **WHEN** the user clicks on an unselected option button
- **THEN** the `onChange` callback is invoked with that option's value

#### Scenario: Clicking selected option does nothing
- **WHEN** the user clicks on the currently selected option button
- **THEN** the `onChange` callback is NOT invoked

### Requirement: Pill button group uses radio semantics
The PillButtonGroup component SHALL use radio group semantics for accessibility.

#### Scenario: Radio group role is applied
- **WHEN** the PillButtonGroup is rendered
- **THEN** the container has `role="radiogroup"`
- **AND** each button has `role="radio"`
- **AND** the selected button has `aria-checked="true"`
- **AND** unselected buttons have `aria-checked="false"`

### Requirement: Pill button group supports keyboard navigation
The PillButtonGroup component SHALL support keyboard navigation between options.

#### Scenario: Arrow keys navigate options
- **WHEN** focus is on a button in the group
- **AND** the user presses the Right or Down arrow key
- **THEN** focus moves to the next option button

#### Scenario: Arrow keys wrap around
- **WHEN** focus is on the last button
- **AND** the user presses the Right or Down arrow key
- **THEN** focus wraps to the first button

#### Scenario: Space or Enter selects option
- **WHEN** focus is on an option button
- **AND** the user presses Space or Enter
- **THEN** the `onChange` callback is invoked with that option's value

### Requirement: Pill button group supports disabled state
The PillButtonGroup component SHALL support a disabled state that prevents all interaction.

#### Scenario: Disabled group prevents interaction
- **WHEN** the PillButtonGroup has `disabled={true}`
- **AND** the user attempts to click or use keyboard
- **THEN** the `onChange` callback is NOT invoked
- **AND** all buttons display with reduced opacity

### Requirement: Pill button group shows focus indicator
The PillButtonGroup component SHALL display a visible focus indicator on the focused button.

#### Scenario: Focus ring on keyboard navigation
- **WHEN** a button receives focus via keyboard
- **THEN** a visible focus ring appears around that button
- **AND** the focus ring uses the cream color consistent with other focusable elements

### Requirement: Pill button group has accessible label
The PillButtonGroup component SHALL require an accessible label for screen readers.

#### Scenario: Aria label is applied
- **WHEN** the PillButtonGroup is rendered with `aria-label` prop
- **THEN** the radiogroup container has the `aria-label` attribute set
