## MODIFIED Requirements

### Requirement: Opponent Display

The system SHALL display opponents around the edge of the viewport with circular avatars, each showing a numbered position badge at the top-left.

#### Scenario: Opponent positioning

- **WHEN** there are N opponents (excluding current player)
- **THEN** opponents are displayed in a horizontal row at the top of the game area
- **AND** opponents are evenly spaced across the row
- **AND** each opponent is displayed as a circular avatar
- **AND** each opponent's avatar has a small numbered badge at its top-left indicating their turn order position

#### Scenario: Opponent avatar display

- **WHEN** displaying an opponent
- **THEN** their animal emoji avatar is shown in a circle
- **AND** their name is displayed in a rounded box that overlaps the avatar's bottom edge
- **AND** the name box has a copper border and felt-dark background
- **AND** the name box has a higher z-index than the avatar

### Requirement: Player Hand Display

The system SHALL display the current player's cards fanned in an arc at the bottom of the screen, with a player number label.

#### Scenario: Hand fan appearance

- **WHEN** the game is playing and the player has cards
- **THEN** cards are displayed in a curved arc resembling cards held in a hand
- **AND** cards overlap slightly with the center card highest
- **AND** each card is rotated to follow the arc curve

#### Scenario: Hand fan sizing

- **WHEN** displaying the player's hand
- **THEN** cards are displayed at full size (larger than opponent cards)
- **AND** the fan adapts to the number of cards (more cards = tighter spacing)

#### Scenario: Hand fits screen width

- **WHEN** the player has many cards
- **THEN** card spacing automatically tightens to fit within the viewport width
- **AND** cards remain accessible and visible

#### Scenario: Player hand fixed to viewport bottom

- **WHEN** displaying the player's hand on mobile
- **THEN** the hand is anchored to the bottom of the viewport
- **AND** remains accessible regardless of screen size

#### Scenario: Player number label

- **WHEN** the game is in a gameplay state
- **THEN** a centered label "You are player number N" SHALL be displayed below the card fan
- **AND** N corresponds to the player's 1-indexed position in the turn order
