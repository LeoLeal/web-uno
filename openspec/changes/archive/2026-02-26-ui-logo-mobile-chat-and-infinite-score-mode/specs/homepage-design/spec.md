## MODIFIED Requirements

### Requirement: Typography uses Nunito consistently

The homepage SHALL use Nunito for the logo text and all UI elements (buttons, labels, hints). Nunito MUST be loaded with appropriate fallbacks.

#### Scenario: Fonts load correctly

- **WHEN** the homepage loads
- **THEN** the logo text displays in Nunito
- **AND** buttons and other UI text display in Nunito

#### Scenario: Font fallback on slow connection

- **WHEN** fonts are still loading
- **THEN** system sans-serif displays as fallback with minimal layout shift
