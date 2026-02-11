## 1. ESLint Configuration

- [x] 1.1 Add `**/*.d.ts` to ignores in `eslint.config.mjs`
- [x] 1.2 Add `@typescript-eslint/no-unused-vars` rule with `argsIgnorePattern`, `varsIgnorePattern`, and `caughtErrorsIgnorePattern` set to `^_`

## 2. Modal Refactors (setState-in-effect)

- [x] 2.1 Remove `isOpen` prop and `useEffect` from `GameSettingsModal.tsx`; pass `isOpen={true}` to inner `<Modal>`
- [x] 2.2 Update `GameSettingsPanel.tsx` to conditionally render with `canConfigure && isModalOpen`
- [x] 2.3 Remove `isOpen` prop, interface, and effect guards from `HostDisconnectModal.tsx`; pass `isOpen={true}` to inner `<Modal>`
- [x] 2.4 Update `app/room/[id]/page.tsx` to conditionally render with `isHostConnected === false`

## 3. Type Fixes (no-explicit-any)

- [x] 3.1 Replace `as any` in `useRoom.ts` with `{ user?: Partial<Omit<Player, 'clientId'>> } | null`
- [x] 3.2 Add `eslint-disable-next-line` for `setMyClientId` in `useRoom.ts`
- [x] 3.3 Replace `any` in `signaling.ts` with `{ type?: string; topics?: string[]; topic?: string }`

## 4. Unused Variable Fixes

- [x] 4.1 `DiscardPile.tsx` — prefix unused map params `(_card, _i)`
- [x] 4.2 `signaling.ts` — prefix catch variable `_e`
- [x] 4.3 `homepage.spec.ts` — remove unused `reverseSymbols`
- [x] 4.4 `lobby.spec.ts` — prefix unused `_roomUrl`
- [x] 4.5 `useGameEngine.test.ts` — remove unused `vi`/`beforeEach` imports; prefix `_playerId`
- [x] 4.6 `useGameSettings.ts` — remove unused `BooleanSettingKey` import
- [x] 4.7 `InfoTooltip.test.tsx` — remove unused `waitFor` import
- [x] 4.8 `GameSettingsPanel.test.tsx` — remove unused `GameSettings` import

## 5. Test Updates

- [x] 5.1 Remove `isOpen` from `GameSettingsModal.test.tsx` defaultProps
- [x] 5.2 Remove `isOpen` from `HostDisconnectModal` renders in `Accessibility.test.tsx`

## 6. Verification

- [x] 6.1 `npm run lint` — 0 errors, 0 warnings
- [x] 6.2 `npm test` — 186/186 tests passing
