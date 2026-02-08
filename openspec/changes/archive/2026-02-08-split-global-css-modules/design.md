## Context

`app/globals.css` (742 lines) mixes design system primitives with component-specific styles. Components reference global class names (e.g., `.toggle-switch`, `.modal`). Next.js 16 supports CSS modules natively.

Current pattern:

```tsx
// ToggleSwitch.tsx
<button className="toggle-switch">
  <span className="toggle-switch__track" />
  <span className="toggle-switch__thumb" />
</button>
```

## Goals / Non-Goals

**Goals:**

- Extract component-specific CSS into co-located `.module.css` files
- Convert components to use CSS module imports with scoped class names
- Keep design system primitives (buttons, inputs, panels) in `globals.css`
- Reduce `globals.css` to ~318 lines (design tokens + utilities)

**Non-Goals:**

- Changing visual appearance (pure refactoring)
- Converting Tailwind utilities to CSS modules
- Modifying the design system primitives

## Decisions

### 1. CSS Module Naming Convention

**Decision:** Use camelCase class names in modules, matching React patterns.

```css
/* ToggleSwitch.module.css */
.root { ... }           /* was .toggle-switch */
.track { ... }          /* was .toggle-switch__track */
.thumb { ... }          /* was .toggle-switch__thumb */
.rootChecked { ... }    /* was .toggle-switch[aria-checked="true"] */
```

**Rationale:** BEM naming (`toggle-switch__track`) is redundant in CSS modules since scoping is automatic. Shorter names improve readability and `styles.track` reads better than `styles['toggle-switch__track']`.

**Alternative considered:** Keep BEM names. Rejected because it defeats the purpose of CSS modules and creates awkward bracket syntax in JSX.

### 2. State Variants Approach

**Decision:** Use separate class names for states, combined with `clsx`.

```tsx
import styles from './ToggleSwitch.module.css';
import { clsx } from 'clsx';

<button className={clsx(styles.root, checked && styles.checked)}>
```

**Rationale:** CSS modules don't support attribute selectors like `[aria-checked="true"]` well. Explicit state classes are clearer and more maintainable.

### 3. CSS Variable Access

**Decision:** CSS modules will reference `:root` variables from `globals.css` directly.

```css
/* ToggleSwitch.module.css */
.track {
  background-color: var(--felt-light); /* from globals.css :root */
}
```

**Rationale:** CSS variables are inherited globally. No import needed. This maintains the design token system.

### 4. Animation Keyframes Location

**Decision:** Move `@keyframes card-fan` into `CardFan.module.css`.

**Rationale:** Animation is only used by `CardFan` component. Keyframe names in CSS modules are auto-scoped, preventing collisions.

### 5. Files to Create

| CSS Module                   | Component                | Lines (~) |
| ---------------------------- | ------------------------ | --------- |
| `ToggleSwitch.module.css`    | `ui/ToggleSwitch.tsx`    | 77        |
| `PillButtonGroup.module.css` | `ui/PillButtonGroup.tsx` | 57        |
| `InfoTooltip.module.css`     | `ui/InfoTooltip.tsx`     | 80        |
| `Modal.module.css`           | `ui/Modal.tsx`           | 110       |
| `CardFan.module.css`         | `ui/CardFan.tsx`         | 50        |
| `PlayerList.module.css`      | `lobby/PlayerList.tsx`   | 85        |

## Risks / Trade-offs

**[Test selector breakage]** → E2E tests using `.toggle-switch` will break.  
_Mitigation:_ Update tests to use component roles/aria attributes instead of CSS classes.

**[clsx dependency]** → Need `clsx` for conditional classes.  
_Mitigation:_ Project already has it (used in AGENTS.md examples).

**[Class name hash changes]** → Snapshot tests might break.  
_Mitigation:_ Run tests after each component conversion to catch early.
