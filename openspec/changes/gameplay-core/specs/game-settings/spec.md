## ADDED Requirements

### Requirement: Card type with optional color
The system SHALL define the `Card` interface with `color` as an optional property.

#### Scenario: Card interface definition
- **WHEN** the `Card` type is used
- **THEN** it has `id: string` (required)
- **AND** it has `color?: CardColor` (optional, where CardColor is `'red' | 'blue' | 'green' | 'yellow'`)
- **AND** it has `symbol: CardSymbol` (required)

#### Scenario: Wild cards have no color in deck
- **WHEN** wild cards are created in the deck
- **THEN** they have `symbol: 'wild'` or `symbol: 'wild-draw4'`
- **AND** they do not have a `color` property (undefined)

#### Scenario: CardColorWithWild type removed
- **WHEN** the card type system is defined
- **THEN** there is no `CardColorWithWild` type
- **AND** the `'wild'` string is not used as a color value anywhere

### Requirement: Player action type definition
The system SHALL define a `PlayerAction` type for the action queue.

#### Scenario: PlayerAction type structure
- **WHEN** the `PlayerAction` type is used
- **THEN** it is a discriminated union with a `type` field
- **AND** `PLAY_CARD` actions include `cardId: string` and optional `chosenColor?: CardColor`
- **AND** `DRAW_CARD` actions include only the `type` field
