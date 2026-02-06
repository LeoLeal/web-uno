# Homepage Design Specification

Visual design system for the homepage implementing the "Card Table" aesthetic.

## ADDED Requirements

### Requirement: Green felt background with texture

The homepage background SHALL display a rich green felt texture created using CSS gradients and SVG noise patterns. The background MUST include a radial vignette effect that darkens toward the edges, creating depth and focus on the center content.

#### Scenario: Background renders on page load
- **WHEN** user navigates to the homepage
- **THEN** the background displays a green gradient (#1a472a to #0d2818) with subtle noise texture and vignette effect

#### Scenario: Background scales to viewport
- **WHEN** the viewport is resized
- **THEN** the background covers the full viewport without tiling artifacts or pixelation

---

### Requirement: Logo displays "WEB UN" with card as "O"

The homepage logo SHALL display "WEB UN" in Playfair Display font (cream color #f5e6c8) with the letter "O" replaced by a tilted wild card. The card MUST be rotated approximately 15 degrees clockwise and include a drop shadow for depth.

#### Scenario: Logo renders correctly on desktop
- **WHEN** user views the homepage on a screen wider than 640px
- **THEN** the logo displays "WEB UN" with the wild card tilted as the "O", with visible drop shadow

#### Scenario: Logo renders correctly on mobile
- **WHEN** user views the homepage on a screen 640px or narrower
- **THEN** the logo scales proportionally while maintaining readability and card visibility

---

### Requirement: Four-card fan decoration on desktop

The homepage SHALL display a fan of 4 overlapping UNO cards centered below the logo on screens wider than 640px. The cards MUST be (left to right): Red +2, Blue Skip, Yellow Reverse, Green Reverse. Each card SHALL be rotated to create a fan effect with drop shadows. Cards are spaced horizontally and middle cards are raised slightly to create an arc effect.

#### Scenario: Card fan displays on desktop
- **WHEN** user views the homepage on a screen wider than 640px
- **THEN** four UNO cards appear fanned below the logo with overlapping edges and rotation

#### Scenario: Cards have proper depth
- **WHEN** user views the card fan
- **THEN** each card displays a drop shadow and cards on the right appear "on top" of cards on the left

---

### Requirement: Three-card fan decoration on mobile

The homepage SHALL display a reduced fan of 3 UNO cards on screens 640px or narrower. The green reverse card MUST be removed, showing only: Red +2, Blue Skip, Yellow Reverse.

#### Scenario: Card fan reduces on mobile
- **WHEN** user views the homepage on a screen 640px or narrower
- **THEN** only three cards appear (Red +2, Blue Skip, Yellow Reverse), with the green card hidden

---

### Requirement: Copper pill-shaped primary button

The "Create New Game" button SHALL be styled as a pill-shaped button with fully rounded ends (border-radius: 9999px). The button MUST use a copper/bronze gradient background (#c4873a to #a66a2a) with a darker border (#8b5a2b), cream text (#f5e6c8), and a soft drop shadow.

#### Scenario: Primary button displays correctly
- **WHEN** user views the homepage
- **THEN** the "Create New Game" button appears as a copper pill with cream text and subtle shadow

#### Scenario: Primary button hover state
- **WHEN** user hovers over the "Create New Game" button (pointer device)
- **THEN** the button displays a lighter gradient and subtle lift effect

#### Scenario: Primary button active state
- **WHEN** user presses the "Create New Game" button
- **THEN** the button displays an inset shadow and slight scale-down effect for tactile feedback

---

### Requirement: Room code input with copper styling

The room code input field SHALL be styled with a copper border (#8b5a2b), dark felt background, and cream placeholder/text. The submit button adjacent to the input MUST use the same copper gradient as the primary button.

#### Scenario: Input field displays correctly
- **WHEN** user views the join room section
- **THEN** the input field shows copper border, dark background, and cream placeholder text

#### Scenario: Input field focus state
- **WHEN** user focuses the room code input
- **THEN** the border becomes brighter/more prominent and a focus ring appears

---

### Requirement: Typography uses Playfair Display and Nunito

The homepage SHALL use Playfair Display for the logo text and Nunito for all UI elements (buttons, labels, hints). Both fonts MUST be loaded via next/font/google with appropriate fallbacks.

#### Scenario: Fonts load correctly
- **WHEN** the homepage loads
- **THEN** the logo displays in Playfair Display and buttons display in Nunito

#### Scenario: Font fallback on slow connection
- **WHEN** fonts are still loading
- **THEN** Georgia (for logo) and system sans-serif (for UI) display as fallbacks with minimal layout shift

---

### Requirement: Animations respect reduced motion preference

All homepage animations SHALL be disabled or reduced to near-instant duration when the user has `prefers-reduced-motion: reduce` set in their system preferences.

#### Scenario: Reduced motion disables animations
- **WHEN** user has reduced motion preference enabled
- **THEN** all animations complete in under 10ms or are skipped entirely

#### Scenario: Normal motion shows animations
- **WHEN** user has no reduced motion preference
- **THEN** logo fades in (600ms), cards fan in with stagger (800ms), and buttons animate on hover (150ms)

---

### Requirement: Color contrast meets accessibility standards

All text on the homepage MUST meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text). Cream text (#f5e6c8) on felt green and copper button backgrounds MUST be validated for sufficient contrast.

#### Scenario: Text contrast is accessible
- **WHEN** user views any text on the homepage
- **THEN** the text meets a minimum contrast ratio of 4.5:1 against its background

#### Scenario: Button text contrast is accessible
- **WHEN** user views button text
- **THEN** cream text on copper gradient meets minimum 4.5:1 contrast ratio

---

### Requirement: Centered layout with responsive stacking

The homepage content SHALL be centered horizontally and vertically on all screen sizes. On narrow screens, elements MUST stack vertically while maintaining appropriate spacing and proportions.

#### Scenario: Desktop layout is centered
- **WHEN** user views homepage on desktop (>640px)
- **THEN** logo, card fan, and action buttons are horizontally and vertically centered

#### Scenario: Mobile layout stacks correctly
- **WHEN** user views homepage on mobile (<=640px)
- **THEN** elements stack vertically, card fan scales down, and touch targets remain accessible (min 44px)
