# UI Components Overview

## Overview

**Title**: UI Components

**Type**: Component Collection

**Status**: Archived

**Priority**: N/A

**Estimated Effort**: N/A

**Date Created**: 2026-01-19

**Last Updated**: 2026-01-20

### Description
This specification has been broken down into separate component specifications for better organization and maintainability. See the individual component specs below for detailed implementation requirements.

### Goals
- Organize UI components into focused, manageable specifications
- Enable parallel development of different UI elements
- Improve spec discoverability and maintenance

### Dependencies
- Game State and Types (specs/types/game-state-types.md)
- Uno Game Logic and Rules (specs/game/uno-logic-rules.md)
- P2P Multiplayer System (specs/_archive/p2p-multiplayer-system-approved.md)

## Component Specifications

This overview has been divided into the following individual component specifications:

### Core Game Components
- [Card Components](card-components.md) - Uno card display and interaction
- [Game Board](game-board.md) - Main game area with discard pile and actions
- [Player Hand](player-hand.md) - Player's card hand management
- [Game Actions](game-actions.md) - Action buttons for gameplay

### Multiplayer Components
- [Game Room Component](game-room-component.md) - Room creation and joining interface
- [Connection Status](connection-status.md) - P2P connection indicators

### Information Display Components
- [Player List](player-list.md) - List of players with status
- [Score Board](score-board.md) - Game scoring and standings

## References

- [Uno Card Designs](https://www.unorules.com/uno-cards/)
- [Material Design Guidelines](https://material.io/design)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)
- [Game State Types](specs/types/game-state-types.md)
- [Uno Logic Spec](specs/game/uno-logic-rules.md)

---

*Spec Version: 1.0 | Status: Archived | See individual component specs for implementation details*