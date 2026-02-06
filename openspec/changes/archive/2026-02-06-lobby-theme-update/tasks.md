## 1. CSS Utilities Setup

- [x] 1.1 Add `.panel-felt` utility class to globals.css (felt background with copper border for modals/panels)
- [x] 1.2 Add `.card-player` utility class to globals.css (cream background, dark text, shadow for player cards)

## 2. Lobby Page Theme

- [x] 2.1 Update app/room/[id]/page.tsx: Remove bg-slate-900 from main element, let felt background show through
- [x] 2.2 Update page.tsx: Convert text colors from slate/white to cream palette (--cream, --cream-dark)
- [x] 2.3 Update page.tsx: Restyle header section with copper border and cream text
- [x] 2.4 Update page.tsx: Change room code hint from "Click to Copy" to "Click to copy room URL"
- [x] 2.5 Update page.tsx: Remove duplicate 'use client' directive at top of file

## 3. Player List Component

- [x] 3.1 Update PlayerList.tsx: Apply cream background (--card-white) to player cards
- [x] 3.2 Update PlayerList.tsx: Change text to dark color (--wood-dark or similar) for contrast
- [x] 3.3 Update PlayerList.tsx: Replace blue "You" border with copper-toned glow/border
- [x] 3.4 Update PlayerList.tsx: Add shadow (--shadow-card) to player cards

## 4. Modal Components

- [x] 4.1 Update JoinGameModal.tsx: Apply .panel-felt styling to modal container
- [x] 4.2 Update JoinGameModal.tsx: Convert input to use .input-copper class
- [x] 4.3 Update JoinGameModal.tsx: Convert button to use .btn-copper class
- [x] 4.4 Update HostDisconnectModal.tsx: Apply .panel-felt styling to modal container
- [x] 4.5 Update HostDisconnectModal.tsx: Convert text colors to cream palette

## 5. Start Game Button

- [x] 5.1 Update StartGameButton.tsx: Convert enabled button to use .btn-copper class
- [x] 5.2 Update StartGameButton.tsx: Style disabled state with desaturated copper variant
- [x] 5.3 Update StartGameButton.tsx: Update waiting message styling to cream palette

## 6. Game Settings Panel

- [x] 6.1 Create components/lobby/GameSettingsPanel.tsx component
- [x] 6.2 Implement settings summary display ("Standard rules - 7 cards - No stacking")
- [x] 6.3 Add "Configure" button visible only to host
- [x] 6.4 Implement "Coming Soon" toast or disabled state when Configure is clicked
- [x] 6.5 Integrate GameSettingsPanel into page.tsx above StartGameButton

## 7. Verification

- [x] 7.1 Run linter (npm run lint) and fix any issues
- [x] 7.2 Run type check (tsc --noEmit) and fix any issues
- [x] 7.3 Visual review: Compare lobby page to homepage for theme consistency (automated via E2E: `e2e/lobby.spec.ts`)
- [x] 7.4 Test: Verify host sees Configure button, non-host does not (automated via E2E + unit tests)
- [x] 7.5 Test: Verify all modals display correctly with new theme (automated via E2E: Modal Theming tests)

## 8. Bug Fixes (discovered during implementation)

- [x] 8.1 Fix host takeover race condition: joiner was claiming host before sync completed
- [x] 8.2 Refactor useRoom.ts to use event-driven host claiming (peers, synced, status events)
- [x] 8.3 Remove setTimeout anti-pattern from host claiming logic

## 9. Design Iterations

- [x] 9.1 Player cards: Add smooth cream gradient backgrounds
- [x] 9.2 Player cards: Add golden circle badge for host crown icon
- [x] 9.3 Player cards: Add yellow glow effect on host card
- [x] 9.4 Player cards: Refine borders (subtle for regular, copper for "You", gold for host)
- [x] 9.5 "You" card: Change to blue hue with blue glow and blue "You" text

## 10. Navigation

- [x] 10.1 Add "Leave" link in header (top-right) that navigates to homepage
- [x] 10.2 Style link with LogOut icon, red ghost button style, hover effect

## 11. Test Automation

- [x] 11.1 Create E2E tests for lobby theme consistency (`e2e/lobby.spec.ts`)
- [x] 11.2 Create E2E tests for Game Settings Panel (host/non-host visibility)
- [x] 11.3 Create E2E tests for modal theming
- [x] 11.4 Create E2E tests for Leave button functionality
- [x] 11.5 Create accessibility unit tests for lobby components (`components/lobby/accessibility.test.tsx`)
- [x] 11.6 Run all tests and verify pass (23 E2E + 29 unit tests pass)
