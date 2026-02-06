## ADDED Requirements

### Requirement: Modal uses native dialog element
The Modal component SHALL use the native HTML `<dialog>` element opened with `.showModal()` to leverage built-in accessibility features.

#### Scenario: Modal renders as dialog element
- **WHEN** a Modal component is rendered with `isOpen={true}`
- **THEN** the underlying element is a `<dialog>` element
- **AND** the dialog is opened using the `.showModal()` method

### Requirement: Modal displays in top layer
The Modal component SHALL render in the browser's top layer when open, ensuring it appears above all other content without z-index management.

#### Scenario: Modal appears above page content
- **WHEN** the Modal is open
- **THEN** it renders in the browser's top layer
- **AND** no z-index is required to position it above other elements

### Requirement: Modal has styled backdrop
The Modal component SHALL display a styled backdrop using the native `::backdrop` pseudo-element.

#### Scenario: Backdrop displays with theme styling
- **WHEN** the Modal is open
- **THEN** a backdrop appears behind the modal
- **AND** the backdrop has a dark semi-transparent background with blur effect

### Requirement: Modal closes on backdrop click
The Modal component SHALL close when the user clicks on the backdrop, if an `onClose` handler is provided.

#### Scenario: Clicking backdrop closes dismissible modal
- **WHEN** the Modal has an `onClose` prop
- **AND** the user clicks on the backdrop (outside the modal content)
- **THEN** the `onClose` callback is invoked

#### Scenario: Clicking inside modal does not close it
- **WHEN** the user clicks inside the modal content
- **THEN** the modal remains open
- **AND** `onClose` is not invoked

#### Scenario: Non-dismissible modal ignores backdrop click
- **WHEN** the Modal does not have an `onClose` prop
- **AND** the user clicks on the backdrop
- **THEN** the modal remains open

### Requirement: Modal closes on Escape key
The Modal component SHALL close when the user presses the Escape key, if an `onClose` handler is provided.

#### Scenario: Escape key closes dismissible modal
- **WHEN** the Modal has an `onClose` prop
- **AND** the user presses the Escape key
- **THEN** the `onClose` callback is invoked

#### Scenario: Non-dismissible modal ignores Escape key
- **WHEN** the Modal does not have an `onClose` prop
- **AND** the user presses the Escape key
- **THEN** the modal remains open

### Requirement: Modal traps focus
The Modal component SHALL trap focus within its content while open, preventing focus from escaping to elements outside the modal.

#### Scenario: Tab cycling stays within modal
- **WHEN** the Modal is open
- **AND** the user presses Tab repeatedly
- **THEN** focus cycles through focusable elements within the modal
- **AND** focus does not move to elements outside the modal

### Requirement: Modal supports accessibility attributes
The Modal component SHALL support ARIA attributes for accessibility.

#### Scenario: Modal has accessible labeling
- **WHEN** the Modal is rendered with `aria-labelledby` prop
- **THEN** the dialog element has the `aria-labelledby` attribute set

#### Scenario: Modal has accessible description
- **WHEN** the Modal is rendered with `aria-describedby` prop
- **THEN** the dialog element has the `aria-describedby` attribute set

### Requirement: Modal has entry animation
The Modal component SHALL animate on open with a fade and scale effect that respects reduced motion preferences.

#### Scenario: Modal animates on open
- **WHEN** the Modal opens
- **THEN** the modal content fades in and scales from 0.95 to 1
- **AND** the backdrop fades in

#### Scenario: Reduced motion disables animation
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **AND** the Modal opens
- **THEN** the modal appears without animation
