## 1. Create CSS Module Files

- [x] 1.1 Create `components/ui/ToggleSwitch.module.css` with styles from globals.css lines 517-594
- [x] 1.2 Create `components/ui/PillButtonGroup.module.css` with styles from globals.css lines 596-656
- [x] 1.3 Create `components/ui/InfoTooltip.module.css` with styles from globals.css lines 658-741
- [x] 1.4 Create `components/ui/Modal.module.css` with styles from globals.css lines 406-515
- [x] 1.5 Create `components/ui/CardFan.module.css` with card-fan keyframes from globals.css lines 105-139
- [x] 1.6 Create `components/lobby/PlayerList.module.css` with card-player styles from globals.css lines 320-404

## 2. Update Component Files

- [x] 2.1 Update `ToggleSwitch.tsx` to import and use CSS module with camelCase classes
- [x] 2.2 Update `PillButtonGroup.tsx` to import and use CSS module
- [x] 2.3 Update `InfoTooltip.tsx` to import and use CSS module
- [x] 2.4 Update `Modal.tsx` to import and use CSS module
- [x] 2.5 Update `CardFan.tsx` to import and use CSS module (including animation)
- [x] 2.6 Update `PlayerList.tsx` to import and use CSS module

## 3. Clean Up globals.css

- [x] 3.1 Remove extracted component styles from `app/globals.css`
- [x] 3.2 Verify remaining styles are design system primitives only (~318 lines)

## 4. Verification

- [x] 4.1 Run `npm run lint` and fix any issues
- [x] 4.2 Run `npm test` and verify all component tests pass
- [x] 4.3 Run `npm run build` to verify production build succeeds
- [x] 4.4 Visual check: verify components render identically in browser
