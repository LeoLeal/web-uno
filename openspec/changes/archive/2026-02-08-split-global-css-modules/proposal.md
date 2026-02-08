## Why

`app/globals.css` has grown to 742 lines, mixing truly global styles (design tokens, body, utilities) with component-specific styles (Modal, ToggleSwitch, etc.). This makes maintenance harder and violates co-location principles. Component styles should live alongside their components.

## What Changes

- Extract component-specific CSS blocks from `globals.css` into co-located CSS modules
- Convert affected components to import their CSS module and use scoped class names
- Retain design system primitives (`.btn-copper`, `.input-copper`, etc.) in `globals.css`

Components affected:

- `components/ui/ToggleSwitch.tsx` → `ToggleSwitch.module.css`
- `components/ui/PillButtonGroup.tsx` → `PillButtonGroup.module.css`
- `components/ui/InfoTooltip.tsx` → `InfoTooltip.module.css`
- `components/ui/Modal.tsx` → `Modal.module.css`
- `components/ui/CardFan.tsx` → `CardFan.module.css` (includes animation keyframes)
- `components/lobby/PlayerList.tsx` → `PlayerList.module.css`

## Capabilities

### New Capabilities

None — this is a refactoring of existing CSS organization.

### Modified Capabilities

None — no behavioral or requirement changes. The UI components will render identically; only the CSS architecture changes.

## Impact

- **Files modified**: `app/globals.css`, 6 component `.tsx` files
- **Files created**: 6 new `.module.css` files
- **Tests**: Existing component tests should continue passing (visual output unchanged)
- **Build**: No changes to build config (Next.js supports CSS modules out of the box)
