# Spec: UI Drawer

## Purpose

A generic, reusable retractable drawer component that slides down from the top of the viewport to reveal content, with a drag handle at its bottom edge. Used on mobile breakpoints only.

## Requirements

### Requirement: Drawer component renders as a top-edge sliding panel

The system SHALL provide a generic `Drawer` component that slides down from the top of the viewport to reveal content, with a drag handle at its bottom edge.

#### Scenario: Collapsed state

- **WHEN** the drawer `isOpen` prop is `false`
- **THEN** only the drag handle is visible at the top of the screen
- **AND** the drawer content is hidden above the viewport via `translateY`

#### Scenario: Expanded state

- **WHEN** the drawer `isOpen` prop is `true`
- **THEN** the drawer content is fully visible
- **AND** the drag handle appears at the bottom edge of the drawer panel

#### Scenario: Drawer renders children

- **WHEN** the drawer is open
- **THEN** it SHALL render its `children` prop inside the panel above the drag handle

### Requirement: Drawer supports tap-to-toggle

The system SHALL allow users to tap the drag handle to toggle the drawer open/closed.

#### Scenario: Tap handle to open

- **WHEN** the drawer is collapsed and the user taps the drag handle
- **THEN** the drawer opens with an animated transition
- **AND** `onOpenChange(true)` is called

#### Scenario: Tap handle to close

- **WHEN** the drawer is expanded and the user taps the drag handle
- **THEN** the drawer closes with an animated transition
- **AND** `onOpenChange(false)` is called

### Requirement: Drawer supports drag gesture

The system SHALL allow users to drag the handle to reveal or dismiss the drawer content.

#### Scenario: Drag down to open

- **WHEN** the drawer is collapsed and the user drags the handle downward past 30% of the drawer content height
- **THEN** the drawer snaps open
- **AND** `onOpenChange(true)` is called

#### Scenario: Drag up to close

- **WHEN** the drawer is expanded and the user drags the handle upward past 30% of the drawer content height
- **THEN** the drawer snaps closed
- **AND** `onOpenChange(false)` is called

#### Scenario: Fast swipe opens/closes

- **WHEN** the user swipes the handle quickly (velocity > threshold) in either direction
- **THEN** the drawer snaps in the swipe direction regardless of distance threshold

#### Scenario: Drag does not trigger tap

- **WHEN** the user drags the handle more than 5px
- **THEN** the tap-to-toggle action SHALL NOT fire on pointer up

### Requirement: Drawer transitions are smooth

The system SHALL animate open/close transitions using GPU-accelerated CSS transforms.

#### Scenario: Animated snap

- **WHEN** the drawer snaps open or closed (after drag release or tap)
- **THEN** the transition uses `transform: translateY()` with a CSS transition (300ms ease-out)

#### Scenario: No transition during active drag

- **WHEN** the user is actively dragging the handle
- **THEN** no CSS transition is applied
- **AND** the drawer position tracks the pointer position in real-time

### Requirement: Drawer is only visible on mobile

The system SHALL render the drawer only at mobile breakpoints (below `md`).

#### Scenario: Mobile rendering

- **WHEN** the viewport width is below the `md` Tailwind breakpoint (768px)
- **THEN** the drawer component is visible and functional

#### Scenario: Desktop hidden

- **WHEN** the viewport width is at or above the `md` breakpoint
- **THEN** the drawer is hidden via CSS (`md:hidden`)
