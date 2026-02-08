## Why

The card asset files use `plus2` naming (e.g., `red-plus2.svg`) while the standard Uno terminology is "Draw Two". This refactoring aligns the file names and code references with the conventional naming used in official Uno rules and documentation.

## What Changes

- Rename 4 SVG files in `public/cards/` from `*-plus2.svg` to `*-draw2.svg`
- Update the `CardSymbol` type union from `'plus2'` to `'draw2'`
- Update all component references and test assertions that use `plus2`

## Capabilities

### New Capabilities

None - this is a pure refactoring change.

### Modified Capabilities

None - no spec-level behavior changes, only naming conventions.

## Impact

- **Files**: `public/cards/{blue,green,red,yellow}-plus2.svg`
- **Components**: `UnoCard.tsx`, `CardFan.tsx`
- **Tests**: `accessibility.test.tsx`, `CardFan.test.tsx`
- **Breaking**: None (internal naming only)
