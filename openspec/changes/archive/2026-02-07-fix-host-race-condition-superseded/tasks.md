## 1. Homepage Updates

- [ ] 1.1 Update `app/page.tsx` to use `onClick` handler for "Create Game".
- [ ] 1.2 Implement logic to generate Room ID, set `sessionStorage` flag, and navigate.
- [ ] 1.3 Verify existing E2E tests for homepage creation flow still pass (or update them).

## 2. Room Logic Updates

- [ ] 2.1 Update `hooks/useRoom.ts` to read `sessionStorage` on mount.
- [ ] 2.2 Refactor `claimHostIfEligible` to respect the intent flag (claim immediately if creator).
- [ ] 2.3 Modify the "default" claim logic (for guests) to be more conservative (wait for sync).
- [ ] 2.4 Ensure `sessionStorage` flag is cleared after use.

## 3. Cleanup

- [ ] 3.1 Delete `app/create/route.ts` as it's no longer used.
- [ ] 3.2 Verify manual URL navigation still allows joining as guest.
