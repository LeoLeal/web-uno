## 1. Dependencies & Setup

- [x] 1.1 Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` via npm

## 2. Player Order State (useRoom hook)

- [x] 2.1 Remove the alphabetical sort from `handleAwarenessChange` in `useRoom.ts`; sort `activePlayers` by `playerOrder` from Yjs instead
- [x] 2.2 Add `playerOrder` management logic: host appends new players, removes departed players, preserves reconnecting players
- [x] 2.3 Expose `reorderPlayers(orderedIds: number[])` callback (host-only, writes new `playerOrder` to Yjs)
- [x] 2.4 Expose `randomizePlayers()` callback (host-only, shuffles `playerOrder` in Yjs)
- [x] 2.5 Add tests for `useRoom` player order management (join-order default, reconnection preservation, reorder, randomize)

## 3. Lobby PlayerList Drag-and-Drop

- [x] 3.1 Keep `PlayerList.tsx` on responsive CSS grid while integrating sortable drag-and-drop
- [x] 3.2 Integrate `@dnd-kit/sortable` with `rectSortingStrategy` for host-only drag-and-drop reordering
- [x] 3.3 Add `GripVertical` drag handle to player cards (visible only to host, positioned top-right)
- [x] 3.4 Add `PlayerList.module.css` styles for drag handle and drag-active states
- [x] 3.5 Wire `onReorder` callback from `PlayerList` to `reorderPlayers` in `useRoom` via room page
- [x] 3.6 Update `PlayerList` props to accept `amIHost` and `onReorder`
- [x] 3.7 Update `Accessibility.test.tsx` for new PlayerList layout and props

## 4. Randomize Button

- [x] 4.1 Add "Randomize order" button (shuffle icon + label) next to player count in lobby header (`room/page.tsx`), visible only to host
- [x] 4.2 Wire button to `randomizePlayers` callback from `useRoom`

## 5. Gameplay Player Number Badges

- [x] 5.1 Add `playerNumber` prop to `OpponentIndicator.tsx`; render a small numbered circle at top-left of avatar with default/active-turn styling
- [x] 5.2 Update `OpponentRow.tsx` to accept and pass `playerNumber` to each `OpponentIndicator`
- [x] 5.3 Add `playerNumber` prop to `PlayerHand.tsx`; render centered "You are player number N" label below the card fan
- [x] 5.4 Compute player numbers from `turnOrder` in `GameBoard.tsx` and pass to `OpponentRow` and `PlayerHand`
- [x] 5.5 Update `GameBoard` props interface to accept `turnOrder`

## 6. Verification

- [x] 6.1 Run full test suite (`npm test`) and fix any regressions
- [x] 6.2 Run lint (`npm run lint`) and type check (`tsc --noEmit`)
- [x] 6.3 Visual verification: lobby player ordering, drag-and-drop, randomize, gameplay number badges
