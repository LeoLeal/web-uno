# Spec: Game Board UI

## Purpose

Visual layout for the Uno game board showing player's hand, opponents, deck, and discard pile.

## Requirements

### Requirement: Player Hand Display

The system SHALL display the current player's cards fanned in an arc at the bottom of the screen.

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

### Requirement: Opponent Display

The system SHALL display opponents around the edge of the viewport with circular avatars.

#### Scenario: Opponent positioning

- **WHEN** there are N opponents (excluding current player)
- **THEN** opponents are displayed in a horizontal row at the top of the game area
- **AND** opponents are evenly spaced across the row
- **AND** each opponent is displayed as a circular avatar

#### Scenario: Opponent avatar display

- **WHEN** displaying an opponent
- **THEN** their animal emoji avatar is shown in a circle
- **AND** their name is displayed in a rounded box that overlaps the avatar's bottom edge
- **AND** the name box has a copper border and felt-dark background
- **AND** the name box has a higher z-index than the avatar

### Requirement: Opponent UNO Indicator

The system SHALL display an "UNO!" indicator overlaid on opponent avatars when they have exactly 1 card.

#### Scenario: Indicator appears at 1 card

- **WHEN** an opponent's card count is exactly 1
- **THEN** a bold "UNO!" text indicator is displayed directly over their avatar
- **AND** the indicator is always visible (not hover-triggered)

#### Scenario: Indicator disappears when card count changes

- **WHEN** an opponent's card count changes from 1 to any other number
- **THEN** the "UNO!" indicator is removed

#### Scenario: Indicator styling and animation

- **WHEN** the "UNO!" indicator is displayed
- **THEN** it uses a highly visible styling (e.g., strong shadow or contrasting stroke) to stand out over the avatar
- **AND** it maintains the existing bouncing animation to draw attention

### Requirement: Opponent Chat Balloon

The system SHALL display temporary chat balloons above opponent avatars when they send a message.

#### Scenario: Balloon appearance on message

- **WHEN** an opponent sends a chat message
- **THEN** a chat balloon containing the message text appears above their avatar
- **AND** the balloon uses a smooth fade-in animation (no bouncing)
- **AND** the balloon text is easily readable against the background

#### Scenario: Balloon positioning

- **WHEN** the chat balloon is displayed
- **THEN** it uses CSS anchor positioning (or fallback absolute positioning) to anchor above and slightly to the right of the avatar, pointing down toward the player

#### Scenario: 10-second fade out per message

- **WHEN** a chat message has been visible for the configured duration (default: 10 seconds)
- **THEN** that specific message is removed from the balloon
- **AND** if a message that will disappear is the only one remaining in the chat balloon, the balloon itself fades-out with the message

#### Scenario: Appending messages within 10-second window

- **WHEN** an opponent sends a new message within 10 seconds of their previous message
- **THEN** the new message text is appended beneath the existing active chat balloon
- **AND** the new message starts its own independent 10-second fade-out timer

### Requirement: Opponent Card Count

The system SHALL display the number of cards each opponent holds using card back images in a fan formation.

#### Scenario: Card count fan display

- **WHEN** an opponent has N cards (any number)
- **THEN** a fan of N card backs is displayed below their avatar
- **AND** all cards are shown in a tight fan (no badge for large counts)
- **AND** cards rotate from a common pivot point (center bottom)
- **AND** the fan has a parabolic vertical offset (center cards slightly higher)

#### Scenario: Card fan arc

- **WHEN** displaying the card count fan
- **THEN** cards rotate up to 90 degrees total (spread across all cards)
- **AND** each card rotates around its bottom center pivot point
- **AND** cards overlap tightly (approximately -10px margin between cards)

### Requirement: Current Turn Indicator

The system SHALL visually highlight the player whose turn it is.

#### Scenario: Current turn highlight

- **WHEN** it is a player's turn
- **THEN** their avatar has a golden border
- **AND** their avatar has a golden glow effect
- **AND** the highlight is clearly visible to all players

#### Scenario: Self turn indicator

- **WHEN** it is the current player's own turn
- **THEN** their hand area is subtly highlighted
- **AND** a visual cue indicates they should play

### Requirement: Table Center Display

The system SHALL display the deck and discard pile in the center of the game area.

#### Scenario: Deck display

- **WHEN** the game is playing
- **THEN** the deck is shown as a stack of face-down cards (card backs)
- **AND** the deck appears as a pile (slight offset to show depth)
- **AND** on desktop (≥768px), cards are displayed at 130x195px (~60% larger)
- **AND** on mobile (<768px), cards are displayed at 80x120px

#### Scenario: Discard pile display

- **WHEN** the game is playing
- **THEN** the discard pile shows the top card face-up
- **AND** previous cards are visible underneath with random rotation (up to +/-30 degrees)
- **AND** previous cards have small random position offsets (organic pile look)
- **AND** transform values for currently visible discard cards remain stable while those cards stay visible
- **AND** cards that leave the visible discard subset are pruned from transform history
- **AND** cards that later re-enter visibility receive newly generated random transform values
- **AND** on desktop (≥768px), cards are displayed at 130x195px (~60% larger)
- **AND** on mobile (<768px), cards are displayed at 80x120px

#### Scenario: Wild card on discard with chosen color

- **WHEN** the top discard card is a wild card with an assigned color
- **THEN** the card is rendered using the `WildCardSvg` component
- **AND** the `chosen-{color}` CSS class is applied
- **AND** all quadrants except the chosen color appear grayscale

### Requirement: Header Preservation

The system SHALL keep the existing lobby header when in the game view.

#### Scenario: Header content

- **WHEN** the game is playing
- **THEN** the header shows room code, connection status, and leave button
- **AND** the header layout matches the lobby header exactly

### Requirement: Responsive Layout

The system SHALL adapt the game board to different screen sizes.

#### Scenario: Mobile layout

- **WHEN** viewport width is less than 768px
- **THEN** opponent avatars are positioned at the top of the screen
- **AND** the table center is in the middle
- **AND** the player's hand is at the bottom with easy thumb access

#### Scenario: Desktop layout

- **WHEN** viewport width is 768px or greater
- **THEN** opponents can be spread more widely
- **AND** more cards can be visible in the player's hand without overlap compression
- **AND** the table center has additional bottom padding (200px) to shift piles upward for better visual prominence

### Requirement: Waiting for Player Modal

The system SHALL display a modal overlay when the game is paused due to player disconnection.

#### Scenario: Modal appears on pause

- **WHEN** the game status changes to `PAUSED_WAITING_PLAYER`
- **THEN** all players see a modal: "Game paused — waiting for a player to rejoin"
- **AND** the modal displays the name(s) and avatar(s) of disconnected player(s)
- **AND** the game board is visible but non-interactive behind the modal

#### Scenario: Host controls in modal

- **WHEN** the host views the Waiting for Player modal
- **THEN** a "Continue without [player name]" button is shown for each disconnected player
- **AND** clicking the button triggers the orphan hand removal flow

#### Scenario: Guest view of modal

- **WHEN** a non-host player views the Waiting for Player modal
- **THEN** they see the disconnected player information
- **AND** they do NOT see the "Continue without" buttons
- **AND** they see a message indicating the host will resolve the situation

#### Scenario: Modal dismisses on resume

- **WHEN** all orphan hands are resolved (replaced or removed)
- **AND** the game status returns to `PLAYING` or `ROUND_ENDED` (restored from `statusBeforePause`)
- **THEN** the modal closes automatically
- **AND** the appropriate UI is restored (gameplay or round-end modal)

### Requirement: Opponent score display

The system SHALL display each opponent's cumulative score next to their avatar during multi-round games.

#### Scenario: Score shown below opponent name

- **WHEN** the game is a multi-round game (`scoreLimit !== null`)
- **AND** an opponent's score is available in `gameStateMap.scores`
- **THEN** the opponent's cumulative score is displayed below their name in the `OpponentIndicator` component
- **AND** the score is formatted as a number followed by "pts" (e.g., "42 pts")

#### Scenario: Score hidden in single-round games

- **WHEN** the game is a single-round game (`scoreLimit === null`)
- **THEN** no score is displayed on opponent indicators

#### Scenario: Score of zero

- **WHEN** a multi-round game has just started (round 1, no rounds completed)
- **THEN** opponent scores display "0 pts"

### Requirement: Player score display

The system SHALL display the current player's own cumulative score in their hand area during multi-round games.

#### Scenario: Player score in header area

- **WHEN** the game is a multi-round game (`scoreLimit !== null`)
- **THEN** the player's cumulative score is displayed near the turn indicator in the `PlayerHand` area
- **AND** the score is formatted consistently with opponent scores (e.g., "42 pts")

#### Scenario: Player score hidden in single-round games

- **WHEN** the game is a single-round game (`scoreLimit === null`)
- **THEN** no score is displayed in the player's hand area

### Requirement: Round end modal

The system SHALL display a modal when a round ends in a multi-round game, showing round results and standings.

#### Scenario: Round end modal appears

- **WHEN** the game status changes to `ROUND_ENDED`
- **THEN** all players see a modal displaying round results
- **AND** the game board is visible but non-interactive behind the modal

#### Scenario: Round end modal content

- **WHEN** the round end modal is displayed
- **THEN** it shows the round winner's name
- **AND** it shows the points gained this round by the winner
- **AND** it shows the current standings (all players sorted by cumulative score, descending)
- **AND** it shows the configured score limit target

#### Scenario: Host controls in round end modal

- **WHEN** the host views the round end modal
- **THEN** a "Next Round" button is displayed
- **AND** clicking the button triggers the round initialization flow

#### Scenario: Guest view of round end modal

- **WHEN** a non-host player views the round end modal
- **AND** they see the round results and standings
- **AND** they do NOT see the "Next Round" button
- **AND** they see a message indicating the host will start the next round

### Requirement: Game end modal with standings

The system SHALL display final standings in the game end modal for multi-round games.

#### Scenario: Multi-round game end modal

- **WHEN** the game status changes to `ENDED` in a multi-round game
- **AND** a player has reached the score limit
- **THEN** the modal shows the overall winner's name
- **AND** the modal shows final standings with all players' cumulative scores sorted descending
- **AND** the modal includes a "Back to Lobby" action

#### Scenario: Single-round game end modal unchanged

- **WHEN** the game status changes to `ENDED` in a single-round game (`scoreLimit === null`)
- **THEN** the existing game end modal behavior is preserved (win/loss message, no scores)

#### Scenario: Insufficient players game end modal

- **WHEN** the game ends with `endType` = `INSUFFICIENT_PLAYERS`
- **THEN** the modal displays "Game Ended" with a "Not enough players to continue" message
- **AND** no winner is declared
- **AND** the modal includes a "Back to Lobby" action

### Requirement: Card click interaction

The system SHALL allow the current player to click cards in their hand to play them.

#### Scenario: Clicking a playable card

- **WHEN** it is the player's turn and they click a card that is playable
- **THEN** the card play action is submitted (or the wild color modal opens if it's a wild card)

#### Scenario: Clicking an unplayable card

- **WHEN** the player clicks a card that is not playable against the current top discard card
- **THEN** no action is submitted
- **AND** the card does not respond to the click

#### Scenario: Clicking a card when not your turn

- **WHEN** it is not the player's turn and they click a card
- **THEN** no action is submitted

### Requirement: Unplayable card visual distinction

The system SHALL visually distinguish cards that cannot be played on the current turn.

#### Scenario: Unplayable cards dimmed

- **WHEN** it is the player's turn
- **THEN** cards that do not match the top discard card's color or symbol (and are not wild) are visually dimmed
- **AND** dimmed cards have reduced opacity or a desaturated appearance

#### Scenario: All cards normal when not your turn

- **WHEN** it is not the player's turn
- **THEN** all cards in the player's hand are displayed at normal opacity
- **AND** no playability distinction is shown

### Requirement: Deck pile click to draw

The system SHALL allow the current player to click the deck pile to draw a card.

#### Scenario: Clicking deck on your turn

- **WHEN** it is the player's turn and they click the deck pile
- **THEN** a `DRAW_CARD` action is submitted

#### Scenario: Clicking deck when not your turn

- **WHEN** it is not the player's turn and they click the deck pile
- **THEN** no action is submitted

#### Scenario: Deck pile cursor

- **WHEN** it is the player's turn
- **THEN** the deck pile shows a pointer cursor
- **WHEN** it is not the player's turn
- **THEN** the deck pile shows a default cursor

### Requirement: Card hover and click feedback

The system SHALL provide visual feedback when interacting with cards.

#### Scenario: Playable card hover

- **WHEN** the player hovers over a playable card on their turn
- **THEN** the card lifts up (existing translateY hover effect)
- **AND** the cursor shows as pointer

#### Scenario: Unplayable card hover

- **WHEN** the player hovers over an unplayable card on their turn
- **THEN** the card does not lift up
- **AND** the cursor shows as not-allowed

### Requirement: Track last played card provenance

The system SHALL track which player most recently played a card to enable provenance-based animations.

#### Scenario: Set lastPlayedBy on card play

- **WHEN** the host processes a valid `PLAY_CARD` action
- **THEN** the `lastPlayedBy` field in game state SHALL be set to the client ID of the player who played the card
- **AND** this value SHALL be synced to all connected clients via Yjs

#### Scenario: Initial lastPlayedBy value

- **WHEN** a new game or round is initialized
- **THEN** `lastPlayedBy` SHALL be `null` (the initial card is revealed, not played)

#### Scenario: Expose lastPlayedBy via hook

- **WHEN** a component calls `useGameState()`
- **THEN** the hook SHALL return `lastPlayedBy` as `number | null`

### Requirement: Discard pile entrance animation

The system SHALL animate newly played cards when they appear on the discard pile based on who played them.

#### Scenario: Opponent card entrance from top

- **WHEN** an opponent plays a card that becomes the new top card on the discard pile
- **THEN** the card animates entrance using the `enterFromTop` keyframe
- **AND** the animation starts with `opacity: 0` and `translateY(-30vh)`
- **AND** the opacity reaches `1` at 50% of the animation duration
- **AND** the card ends at its final transform position from `transformsById`
- **AND** the animation duration is 600ms with ease-out timing

#### Scenario: Current player card entrance from bottom

- **WHEN** the current player plays a card that becomes the new top card on the discard pile
- **THEN** the card animates entrance using the `enterFromBottom` keyframe
- **AND** the animation starts with `opacity: 1` and `translateY(40vh)`
- **AND** the card ends at its final transform position from `transformsById`
- **AND** the animation duration is 600ms with ease-out timing

#### Scenario: Previous cards remain static

- **WHEN** a new card is added to the discard pile
- **THEN** cards already in the visible discard pile do not animate
- **AND** only the top card (most recently played) receives the entrance animation

#### Scenario: No animation when lastPlayedBy is null

- **WHEN** the discard pile is displayed but `lastPlayedBy` is `null`
- **THEN** no entrance animation is applied to any card
- **AND** cards are displayed with their static transforms only

#### Scenario: Entrance rotation is random

- **WHEN** a card receives an entrance animation
- **THEN** the starting rotation is a random value between -420° and 420°
- **AND** the rotation value is set via CSS variable `--entrance-rotation-start`
- **AND** the final rotation uses the value from `transformsById` via CSS variable `--final-rotation`

#### Scenario: Final position uses existing transforms

- **WHEN** a card receives an entrance animation
- **THEN** the final `translateX` and `translateY` values use the offsets from `transformsById`
- **AND** the values are set via CSS variables `--final-offset-x` and `--final-offset-y`

### Requirement: Disconnected Player Indicator

The system SHALL visually indicate disconnected opponents on the game board.

#### Scenario: Opponent disconnect indicator

- **WHEN** a locked opponent loses their awareness connection
- **AND** the game is in `PAUSED_WAITING_PLAYER` status
- **THEN** the opponent's avatar is dimmed or greyed out
- **AND** a disconnection icon (e.g., a broken link or X) is overlaid on their avatar

#### Scenario: Reconnected/replaced player indicator

- **WHEN** a replacement player takes over an orphaned hand
- **THEN** the avatar updates to show the new player's name and avatar
- **AND** the dimming/disconnect indicator is removed
