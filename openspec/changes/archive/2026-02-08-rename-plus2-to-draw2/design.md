## Context

The codebase uses `plus2` naming for Draw Two cards in file names and TypeScript types. This is inconsistent with standard Uno terminology ("Draw Two"). This refactoring updates all references to use `draw2` for consistency.

**Current state:**

- 4 SVG files: `{blue,green,red,yellow}-plus2.svg`
- `CardSymbol` type includes `'plus2'`
- Components and tests reference `plus2`

## Goals / Non-Goals

**Goals:**

- Rename all `plus2` references to `draw2` across assets and code
- Maintain all existing functionality unchanged

**Non-Goals:**

- Changing card behavior or game logic
- Updating any other card naming conventions

## Decisions

**1. Use `draw2` naming (not `drawTwo` or `draw-two`)**

- Matches existing pattern: `wild-draw4` uses numeric suffix
- Keeps file names short and consistent

**2. Single atomic change**

- Rename files and update all code references together
- Avoids broken state between commits

## Risks / Trade-offs

- **Risk**: Missed references → broken images/types  
  **Mitigation**: Run full test suite + grep verification after changes
