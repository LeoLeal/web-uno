## Context

The Game Settings panel currently shows a hardcoded summary ("Standard rules · 7 cards · No stacking") with a placeholder "Coming Soon" toast. The existing modals (`JoinGameModal`, `HostDisconnectModal`) each implement their own backdrop/positioning logic without shared infrastructure.

The game uses Yjs CRDT for P2P state synchronization, with a host-authoritative model. Settings should be stored in the Yjs document so guests receive updates when the host changes configuration.

## Goals / Non-Goals

**Goals:**
- Functional game settings configuration with 8 options (2 discrete, 6 boolean)
- Reusable UI components following the copper/felt theme
- Shared Modal component using native `<dialog>` for accessibility
- Settings synced via Yjs to all players
- Host-only editing with read-only display for guests

**Non-Goals:**
- Custom/freeform settings (only predefined options)
- Settings presets or saved configurations
- Mid-game settings changes (locked once game starts)
- Exit animations for modal (entry only for simplicity)

## Decisions

### Decision 1: Native `<dialog>` element for Modal

**Choice**: Use the native HTML `<dialog>` element instead of custom div-based modals.

**Rationale**:
- Built-in focus trap when opened with `.showModal()`
- Native `::backdrop` pseudo-element (no extra DOM)
- Escape key handling via `cancel` event
- Top-layer rendering (no z-index management)
- Inert background (blocks interaction outside)
- Accessible by default (`role="dialog"`, `aria-modal="true"`)

**Alternatives considered**:
- Custom div with portal: More code, manual focus trap, scroll lock, z-index wars
- Headless UI / Radix Dialog: External dependency, overkill for this use case

### Decision 2: CSS Anchor Positioning for tooltips

**Choice**: Use CSS anchor positioning (`anchor-name`, `position-anchor`, `inset-area`) for tooltip placement.

**Rationale**:
- No JavaScript positioning calculations
- Automatic viewport boundary handling with `position-try-fallbacks`
- Modern CSS feature with good browser support (Chrome 125+, Edge 125+)
- Graceful degradation possible

**Alternatives considered**:
- Popper.js / Floating UI: JavaScript dependency, more complex
- Fixed positioning with manual calculations: Brittle, doesn't handle viewport edges

### Decision 3: Toggle switches over checkboxes

**Choice**: Use custom toggle switch components for boolean settings.

**Rationale**:
- Better touch targets for mobile
- Clearer on/off visual state
- Matches modern UI expectations for settings
- Consistent with the copper/felt theme (styled as themed component)

### Decision 4: Pill button groups for discrete options

**Choice**: Use grouped pill-shaped buttons for hand size (5/7/10) and score limit (100/200/300/500/∞).

**Rationale**:
- Clear visual indication of selected option
- Faster selection than dropdown
- Works well with limited option counts (3-5 options)
- Radio button semantics (`role="radiogroup"`) for accessibility

### Decision 5: Settings stored in Yjs document

**Choice**: Store settings in `Y.Doc.getMap('gameSettings')` alongside `gameState`.

**Rationale**:
- Consistent with existing state sync pattern
- Automatic propagation to all peers
- Settings available before game starts (in LOBBY status)

**Structure**:
```typescript
// Yjs document maps
gameState: { status: 'LOBBY' | 'PLAYING' | 'ENDED' }
gameSettings: GameSettings  // new map for settings
```

### Decision 6: Draft state pattern for modal

**Choice**: Modal maintains local draft state; changes only commit to Yjs on "Save".

**Rationale**:
- Prevents flickering as user adjusts settings
- Allows "Reset to Defaults" without affecting live settings
- Cancel/close discards uncommitted changes (no confirmation needed)

## Risks / Trade-offs

**[CSS Anchor Positioning browser support]** → Safari support is limited (behind flag). Mitigation: Tooltips degrade gracefully—info icon still visible, tooltip just won't position perfectly. Consider polyfill or fallback styling for Safari users.

**[Mobile tooltip tap behavior]** → Need JavaScript to handle tap-to-show/tap-elsewhere-to-hide. Mitigation: Simple state toggle with click-outside detection; not a complex implementation.

**[Modal migration scope creep]** → Refactoring existing modals to use shared Modal adds work. Mitigation: Migration is straightforward since existing modals follow the same pattern; shared component reduces future maintenance.

**[Settings sync race conditions]** → Host might change settings while guest is viewing. Mitigation: Yjs handles this; guests see read-only view that updates in real-time. No conflict resolution needed since only host can write.

## File Structure

```
components/
├── ui/
│   ├── Modal.tsx              # Shared native dialog wrapper
│   ├── ToggleSwitch.tsx       # Boolean toggle (md size)
│   ├── PillButtonGroup.tsx    # Discrete option selector
│   └── InfoTooltip.tsx        # Hover/tap info tooltip
└── lobby/
    ├── GameSettingsPanel.tsx  # Existing (add modal trigger, dynamic display)
    └── GameSettingsModal.tsx  # New configuration modal

lib/
└── game/
    └── settings.ts            # Types, defaults, descriptions

app/
└── globals.css                # New styles for modal, toggle, etc.
```

## Component APIs

### Modal
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;  // undefined = non-dismissible
  children: React.ReactNode;
  className?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}
```

### ToggleSwitch
```typescript
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
```

### PillButtonGroup
```typescript
interface PillButtonGroupProps<T extends string | number | null> {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  'aria-label': string;
}
```

### InfoTooltip
```typescript
interface InfoTooltipProps {
  content: string;
  'aria-label'?: string;
}
```

### GameSettings Type
```typescript
interface GameSettings {
  startingHandSize: 5 | 7 | 10;
  scoreLimit: 100 | 200 | 300 | 500 | null;
  drawStacking: boolean;
  jumpIn: boolean;
  zeroSwap: boolean;
  sevenSwap: boolean;
  forcePlay: boolean;
  multipleCardPlay: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  startingHandSize: 7,
  scoreLimit: null,
  drawStacking: false,
  jumpIn: false,
  zeroSwap: false,
  sevenSwap: false,
  forcePlay: false,
  multipleCardPlay: false,
};
```
