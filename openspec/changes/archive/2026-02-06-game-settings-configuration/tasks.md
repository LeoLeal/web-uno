## 1. Game Settings Types & Defaults

- [x] 1.1 Create `lib/game/settings.ts` with GameSettings interface and type definitions
- [x] 1.2 Add DEFAULT_SETTINGS constant with standard Uno rules
- [x] 1.3 Add SETTING_DESCRIPTIONS object with tooltip content for each setting

## 2. Shared Modal Component

- [x] 2.1 Add modal CSS styles to `globals.css` (dialog reset, backdrop, animations)
- [x] 2.2 Create `components/ui/Modal.tsx` using native `<dialog>` element
- [x] 2.3 Implement backdrop click detection and `onClose` handling
- [x] 2.4 Implement Escape key handling via `onCancel` event
- [x] 2.5 Add support for non-dismissible modals (no `onClose` prop)
- [x] 2.6 Write tests for Modal component

## 3. Toggle Switch Component

- [x] 3.1 Add toggle switch CSS styles to `globals.css`
- [x] 3.2 Create `components/ui/ToggleSwitch.tsx` with on/off states
- [x] 3.3 Implement keyboard interaction (Space, Enter)
- [x] 3.4 Add `role="switch"` and `aria-checked` accessibility attributes
- [x] 3.5 Add disabled state support
- [x] 3.6 Write tests for ToggleSwitch component

## 4. Pill Button Group Component

- [x] 4.1 Add pill button group CSS styles to `globals.css`
- [x] 4.2 Create `components/ui/PillButtonGroup.tsx` with selected/unselected states
- [x] 4.3 Implement keyboard navigation (arrow keys, Space, Enter)
- [x] 4.4 Add `role="radiogroup"` and `role="radio"` accessibility attributes
- [x] 4.5 Add disabled state support
- [x] 4.6 Write tests for PillButtonGroup component

## 5. Info Tooltip Component

- [x] 5.1 Add tooltip CSS styles to `globals.css` with CSS anchor positioning
- [x] 5.2 Create `components/ui/InfoTooltip.tsx` with info icon
- [x] 5.3 Implement hover/focus behavior for desktop
- [x] 5.4 Implement tap toggle behavior for mobile
- [x] 5.5 Add `role="tooltip"` and `aria-describedby` accessibility attributes
- [x] 5.6 Write tests for InfoTooltip component

## 6. Settings Yjs Integration

- [x] 6.1 Create `hooks/useGameSettings.ts` hook for reading settings from Yjs
- [x] 6.2 Add settings initialization logic for host (populate defaults)
- [x] 6.3 Add settings update function for host to modify Yjs document
- [x] 6.4 Write tests for useGameSettings hook

## 7. Game Settings Modal

- [x] 7.1 Create `components/lobby/GameSettingsModal.tsx` component
- [x] 7.2 Implement Deal section with PillButtonGroup for hand size and score limit
- [x] 7.3 Implement House Rules section with ToggleSwitch for each rule
- [x] 7.4 Add InfoTooltip for each setting with descriptions
- [x] 7.5 Implement draft state management (local copy of settings)
- [x] 7.6 Implement Save button to commit draft to Yjs
- [x] 7.7 Implement Reset to Defaults button
- [x] 7.8 Write tests for GameSettingsModal component

## 8. Game Settings Panel Updates

- [x] 8.1 Update `GameSettingsPanel.tsx` to read settings from useGameSettings hook
- [x] 8.2 Implement dynamic summary text based on current settings
- [x] 8.3 Replace "Coming Soon" toast with modal open on Configure click
- [x] 8.4 Hide Configure button when game status is PLAYING or ENDED
- [x] 8.5 Write tests for updated GameSettingsPanel component

## 9. Migrate Existing Modals

- [x] 9.1 Refactor `JoinGameModal.tsx` to use shared Modal component
- [x] 9.2 Refactor `HostDisconnectModal.tsx` to use shared Modal component
- [x] 9.3 Update tests for refactored modals
- [x] 9.4 Verify E2E tests still pass with refactored modals
