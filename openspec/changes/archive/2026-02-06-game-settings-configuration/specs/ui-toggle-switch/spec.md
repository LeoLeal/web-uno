## ADDED Requirements

### Requirement: Toggle switch displays on/off state
The ToggleSwitch component SHALL visually indicate its checked state using distinct styling for on and off states.

#### Scenario: Off state styling
- **WHEN** the ToggleSwitch has `checked={false}`
- **THEN** the track displays with felt-light background color
- **AND** the thumb is positioned on the left
- **AND** the thumb displays with cream-dark color

#### Scenario: On state styling
- **WHEN** the ToggleSwitch has `checked={true}`
- **THEN** the track displays with copper gradient background
- **AND** the thumb is positioned on the right
- **AND** the thumb displays with cream color
- **AND** the track has a warm glow effect

### Requirement: Toggle switch is interactive
The ToggleSwitch component SHALL toggle its state when clicked.

#### Scenario: Clicking toggle changes state
- **WHEN** the user clicks on the ToggleSwitch
- **THEN** the `onChange` callback is invoked with the opposite boolean value

### Requirement: Toggle switch supports keyboard interaction
The ToggleSwitch component SHALL be operable via keyboard.

#### Scenario: Space key toggles state
- **WHEN** the ToggleSwitch has focus
- **AND** the user presses the Space key
- **THEN** the `onChange` callback is invoked with the opposite boolean value

#### Scenario: Enter key toggles state
- **WHEN** the ToggleSwitch has focus
- **AND** the user presses the Enter key
- **THEN** the `onChange` callback is invoked with the opposite boolean value

### Requirement: Toggle switch has correct semantics
The ToggleSwitch component SHALL use switch role semantics for accessibility.

#### Scenario: Switch role is applied
- **WHEN** the ToggleSwitch is rendered
- **THEN** the element has `role="switch"`
- **AND** the element has `aria-checked` matching the `checked` prop

### Requirement: Toggle switch supports disabled state
The ToggleSwitch component SHALL support a disabled state that prevents interaction.

#### Scenario: Disabled toggle cannot be changed
- **WHEN** the ToggleSwitch has `disabled={true}`
- **AND** the user attempts to click or use keyboard
- **THEN** the `onChange` callback is NOT invoked
- **AND** the component displays with reduced opacity

### Requirement: Toggle switch shows focus indicator
The ToggleSwitch component SHALL display a visible focus indicator when focused via keyboard.

#### Scenario: Focus ring on keyboard navigation
- **WHEN** the ToggleSwitch receives focus via keyboard (Tab key)
- **THEN** a visible focus ring appears around the component
- **AND** the focus ring uses the cream color consistent with other focusable elements

### Requirement: Toggle switch animates state change
The ToggleSwitch component SHALL animate the thumb position and color changes with a smooth transition that respects reduced motion preferences.

#### Scenario: Smooth transition on toggle
- **WHEN** the ToggleSwitch state changes
- **THEN** the thumb slides smoothly to its new position
- **AND** colors transition smoothly

#### Scenario: Reduced motion disables animation
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **AND** the ToggleSwitch state changes
- **THEN** the state changes without animation
