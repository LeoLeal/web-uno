# Homepage Card Table Design - Tasks

Implementation checklist for the "Card Table" aesthetic redesign.

## 1. Foundation: Fonts & CSS Variables

- [x] 1.1 Configure Playfair Display and Nunito fonts in `app/layout.tsx` using `next/font/google`
- [x] 1.2 Add CSS custom properties (design tokens) to `app/globals.css` for colors, gradients, and shadows
- [x] 1.3 Add `prefers-reduced-motion` media query to disable/reduce animations globally

## 2. Background & Atmosphere

- [x] 2.1 Create felt green gradient background (#1a472a → #0d2818) in `app/globals.css`
- [x] 2.2 Add SVG noise filter for felt texture effect
- [x] 2.3 Implement radial vignette overlay for edge darkening
- [x] 2.4 Test background rendering across Chrome, Firefox, Safari (automated via Playwright)

## 3. Logo Component

- [x] 3.1 Create `Logo` component with "WEB UN" text in Playfair Display
- [x] 3.2 Build the wild card element as the "O" (tilted 15°, drop shadow)
- [x] 3.3 Add corner pip styling to the card element
- [x] 3.4 Implement fade-in + rise animation on load (600ms)
- [x] 3.5 Add responsive scaling for mobile viewports

## 4. Decorative Card Component

- [x] 4.1 Create reusable `UnoCard` component with props for color, symbol, and rotation
- [x] 4.2 Style card with cream base, colored oval center, and rounded corners
- [x] 4.3 Implement symbols: "+2" text, "0" circle, and reverse arrow (⟲)
- [x] 4.4 Add drop shadow matching mockup depth

## 5. Card Fan Display

- [x] 5.1 Create `CardFan` component that renders 4 cards with rotation (-15°, -5°, +5°, +15°)
- [x] 5.2 Implement overlapping layout with negative margins and z-index stacking
- [x] 5.3 Add staggered fade-in + rotate animation on load (800ms total)
- [x] 5.4 Implement responsive behavior: hide green card on mobile (≤640px), show 3 cards

## 6. Button Styling

- [x] 6.1 Create copper pill button styles (gradient, border, shadow, rounded ends)
- [x] 6.2 Implement hover state: lighter gradient + subtle lift (translateY + shadow)
- [x] 6.3 Implement active state: inset shadow + scale-down for touch feedback
- [x] 6.4 Add transition animations (150ms)

## 7. Form Elements

- [x] 7.1 Style room code input: copper border, dark felt background, cream text
- [x] 7.2 Implement focus state: brighter border + focus ring
- [x] 7.3 Style submit button to match primary button gradient
- [x] 7.4 Add "or join" divider with copper accent line

## 8. Homepage Layout Integration

- [x] 8.1 Update `app/page.tsx` to use new Logo component
- [x] 8.2 Add CardFan below logo
- [x] 8.3 Replace existing buttons with new copper pill styling
- [x] 8.4 Replace existing input with new copper-styled form
- [x] 8.5 Ensure centered layout with proper spacing
- [x] 8.6 Verify vertical centering on viewport

## 9. Responsive & Mobile

- [x] 9.1 Test layout on mobile viewport (≤640px) (automated via Playwright)
- [x] 9.2 Verify card fan reduces to 3 cards on mobile (automated via Playwright)
- [x] 9.3 Ensure touch targets are minimum 44px (automated via Playwright)
- [x] 9.4 Test logo scaling on small screens (automated via Playwright)

## 10. Accessibility & Polish

- [x] 10.1 Validate color contrast with axe-core (4.5:1 minimum) (automated via vitest-axe)
- [x] 10.2 Test with `prefers-reduced-motion` enabled (automated via Playwright)
- [x] 10.3 Verify keyboard navigation and focus states (automated via vitest-axe + Playwright)
- [x] 10.4 Test accessibility violations for all components (automated via vitest-axe)

## 11. Testing

- [x] 11.1 Add visual regression snapshot test for homepage (automated via Playwright)
- [x] 11.2 Add component test for Logo rendering (requires @testing-library/react)
- [x] 11.3 Add component test for CardFan (4 cards desktop, 3 cards mobile) (requires @testing-library/react)
- [x] 11.4 Add component test for UnoCard component (requires @testing-library/react)
