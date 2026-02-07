## 1. Homepage Reversion

- [ ] 1.1 Revert `app/page.tsx` to use `<Link>` instead of `<button>`.
- [ ] 1.2 Remove client-side ID generation logic from homepage.
- [ ] 1.3 Verify homepage E2E tests (revert role checks).

## 2. Server Route Implementation

- [ ] 2.1 Re-create `app/create/route.ts`.
- [ ] 2.2 Implement logic to generate ID and set `room-creator` cookie.
- [ ] 2.3 Implement redirect to room URL.

## 3. Room Logic Updates

- [ ] 3.1 Update `hooks/useRoom.ts` to read `document.cookie` for `room-creator` flag.
- [ ] 3.2 Ensure cookie is cleared (by setting expiry or overwriting) after claiming.
- [ ] 3.3 Implement Guest UI Fix: Set `isSynced(true)` for guests in `status` handler to unblock modals.
- [ ] 3.4 Verify manual URL creation (Guest flow) now shows Join Modal.
