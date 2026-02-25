## 1. Shared Card Playability Utility

- [x] 1.1 Add `isCardPlayable(card, topDiscard)` pure function to `lib/game/cards.ts`
- [x] 1.2 Add `hasPlayableCard(hand, topDiscard)` pure function to `lib/game/cards.ts`
- [x] 1.3 Add unit tests for `isCardPlayable` and `hasPlayableCard` in `lib/game/cards.test.ts`

## 2. Refactor Existing Playability Checks

- [x] 2.1 Replace inline playability check in `useGameEngine.ts` (PLAY_CARD validation) with `isCardPlayable`
- [x] 2.2 Replace inline playability check in `useGamePlay.ts` (`canPlayCard`) with `isCardPlayable`

## 3. Force Play Engine Enforcement

- [x] 3.1 Add `forcePlay?: boolean` to `UseGameEngineOptions` interface in `useGameEngine.ts`
- [x] 3.2 Add Force Play guard in `DRAW_CARD` handler: reject draw if `forcePlay` enabled and `hasPlayableCard` returns true
- [x] 3.3 Add `forcePlay` to the `useEffect` dependency array for the action observer
- [x] 3.4 Pass `settings.forcePlay` to `useGameEngine` in `app/room/page.tsx`

## 4. Client-Side Force Play UX

- [x] 4.1 Add optional `UseGamePlayOptions` parameter to `useGamePlay` hook (accepts `forcePlay` and `hand`)
- [x] 4.2 Add `canDraw` to `UseGamePlayReturn` (false when `forcePlay` enabled and hand has playable cards)
- [x] 4.3 Pass `forcePlay` and `hand` to `useGamePlay` in `app/room/page.tsx`
- [x] 4.4 Thread `canDraw` through to `GameBoard` → `DeckPile` to disable draw interaction
- [x] 4.5 Add `canDraw` tests in `hooks/useGamePlay.test.ts`

## 5. Disable Unimplemented House Rule Toggles

- [x] 5.1 Add `IMPLEMENTED_RULES` set to `lib/game/settings.ts`
- [x] 5.2 Import `IMPLEMENTED_RULES` in `GameSettingsModal.tsx` and set `disabled` on unimplemented toggles
- [x] 5.3 Add "Coming soon" label next to disabled toggles
- [x] 5.4 Add tests for disabled/enabled toggle states in `GameSettingsModal.test.tsx`

## 6. Verification

- [x] 6.1 Run full test suite (`npm test`) — zero failures introduced (445/447 pass; 2 pre-existing ChatInput failures)
- [x] 6.2 Run lint check (`npm run lint`) — zero new errors (3 pre-existing in `ChatNetwork.test.ts`)
