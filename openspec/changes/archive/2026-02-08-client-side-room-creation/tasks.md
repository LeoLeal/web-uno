## 1. Delete Server Route

- [x] 1.1 Delete `app/create/route.ts`

## 2. Update Home Page

- [x] 2.1 Convert "Create New Game" from `<Link>` to `<button>` with onClick handler
- [x] 2.2 Implement onClick: generate room ID, store in sessionStorage, navigate with router.push
- [x] 2.3 Add useEffect to clear `room-creator` from sessionStorage on mount (defensive cleanup)

## 3. Update Room Hook

- [x] 3.1 Replace cookie detection with sessionStorage check in `useRoom.ts`
- [x] 3.2 Clear sessionStorage entry after reading (not cookie)
- [x] 3.3 Remove cookie-related code and comments

## 4. Testing

- [x] 4.1 Update `app/page.test.tsx` for button-based creation
- [x] 4.2 Verify host claiming works with sessionStorage approach
- [x] 4.3 Run full test suite to confirm no regressions
