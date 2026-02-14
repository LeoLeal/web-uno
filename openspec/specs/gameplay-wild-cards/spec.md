# Spec: Gameplay Wild Cards

## Purpose

Defines wild card mechanics in Uno - color selection, rendering, and special effects for wild and wild draw four cards.

## Requirements

### Requirement: Wild card color selection modal
The system SHALL display a modal for the player to choose a color when playing a wild card.

#### Scenario: Modal opens on wild card click
- **WHEN** the current player clicks a wild card (wild or wild-draw4) in their hand
- **THEN** a color selection modal opens
- **AND** the modal displays 4 color options: red, blue, green, yellow
- **AND** the game board remains visible behind the modal

#### Scenario: Color selection submits action
- **WHEN** the player selects a color in the modal
- **THEN** a `PLAY_CARD` action is submitted with `cardId` and `chosenColor`
- **AND** the modal closes

#### Scenario: Modal dismissal cancels play
- **WHEN** the player dismisses the modal (e.g., clicks outside or presses Escape)
- **THEN** no action is submitted
- **AND** the card remains in the player's hand

### Requirement: Wild card color mutation
The system SHALL assign the chosen color to a wild card when it is played.

#### Scenario: Wild card gains color on play
- **WHEN** the host executes a wild card play with a chosen color
- **THEN** the card's `color` property is set to the chosen color before adding to the discard pile
- **AND** the card on the discard pile has `symbol: 'wild'` (or `'wild-draw4'`) and `color: <chosenColor>`

### Requirement: Wild Draw Four effect
The system SHALL force the next player to draw 4 cards when a Wild Draw Four is played.

#### Scenario: Wild Draw Four card played
- **WHEN** a player plays a Wild Draw Four card with a chosen color
- **THEN** the host deals 4 cards from the deck to the next player
- **AND** those cards are added to the next player's hand in `dealtHandsMap`
- **AND** the next player's card count is incremented by 4
- **AND** the next player's turn is skipped

### Requirement: Inlined SVG wild card rendering
The system SHALL render wild card designs using inlined SVG paths in a React component for CSS-based color manipulation.

#### Scenario: Inlined SVG component
- **WHEN** the `WildCardSvg` component is rendered
- **THEN** the SVG path data is defined inline in the component
- **AND** color paths use CSS class `className="quad-{color}"` (quad-red, quad-blue, quad-yellow, quad-green)
- **AND** inline `style` fill attributes are NOT used on color paths

#### Scenario: SVG path CSS classes
- **WHEN** the wild card SVG paths are defined
- **THEN** all red quadrant paths use CSS class `quad-red`
- **AND** all blue quadrant paths use CSS class `quad-blue`
- **AND** all yellow quadrant paths use CSS class `quad-yellow`
- **AND** all green quadrant paths use CSS class `quad-green`

### Requirement: Wild card discard rendering with chosen color
The system SHALL display played wild cards on the discard pile with only the chosen color visible.

#### Scenario: Grayscale except chosen color
- **WHEN** a wild card with an assigned color is displayed on the discard pile
- **THEN** the SVG is rendered with a CSS class `chosen-{color}` on the wrapper
- **AND** all quadrant paths except the chosen color's paths are rendered in grayscale
- **AND** the chosen color's paths retain their original fill color

#### Scenario: Unplayed wild in hand shows all colors
- **WHEN** a wild card with no assigned color is displayed in the player's hand
- **THEN** all four color quadrants are rendered with their original colors
- **AND** no grayscale effect is applied

### Requirement: Wild card CSS color definitions
The system SHALL define CSS classes for wild card quadrant colors and chosen-color states.

#### Scenario: Base color classes
- **WHEN** a wild card SVG is rendered
- **THEN** `.quad-red` fills with `#ed1c24`
- **AND** `.quad-blue` fills with `#0077c0`
- **AND** `.quad-yellow` fills with `#ffcc00`
- **AND** `.quad-green` fills with `#00a651`

#### Scenario: Chosen color overrides
- **WHEN** a `chosen-{color}` class is applied to the wild card wrapper
- **THEN** all quadrant classes except the matching color are overridden to a grayscale fill
