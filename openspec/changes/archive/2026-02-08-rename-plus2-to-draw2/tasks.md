## 1. Rename Asset Files

- [x] 1.1 Rename `public/cards/blue-plus2.svg` to `public/cards/blue-draw2.svg`
- [x] 1.2 Rename `public/cards/green-plus2.svg` to `public/cards/green-draw2.svg`
- [x] 1.3 Rename `public/cards/red-plus2.svg` to `public/cards/red-draw2.svg`
- [x] 1.4 Rename `public/cards/yellow-plus2.svg` to `public/cards/yellow-draw2.svg`

## 2. Update Type Definitions

- [x] 2.1 Update `CardSymbol` type in `components/ui/UnoCard.tsx`: change `'plus2'` to `'draw2'`

## 3. Update Component References

- [x] 3.1 Update `CardFan.tsx`: change `symbol: 'plus2'` to `symbol: 'draw2'`

## 4. Update Tests

- [x] 4.1 Update `accessibility.test.tsx`: change test to use `symbol="draw2"`
- [x] 4.2 Update `CardFan.test.tsx`: change alt text assertions from `'red plus2 card'` to `'red draw2 card'`
- [x] 4.3 Update `CardFan.test.tsx`: change src assertion from `'red-plus2.svg'` to `'red-draw2.svg'`

## 5. Verification

- [x] 5.1 Run `npm run lint` to verify no lint errors (lint config issue unrelated to changes)
- [x] 5.2 Run `npm test` to verify all tests pass (our changes pass; 4 pre-existing failures in gameSettingsPanel.test.tsx)
- [x] 5.3 Grep for remaining `plus2` references to ensure none were missed (confirmed: only in openspec change artifacts)
