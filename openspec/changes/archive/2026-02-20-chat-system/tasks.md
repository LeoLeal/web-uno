## 1. Network Infrastructure

- [x] 1.1 Create `lib/websocket/ChatNetwork.ts` to manage the WebSocket connection to the signaling server and pub/sub messaging for a given room.

## 2. React Integration

- [x] 2.1 Create the `useChatNetwork(roomId, gameClientId)` hook to integrate the custom WebSocket network into the React lifecycle.
- [x] 2.2 Ensure the hook subscribes to the `[room-id]-chat` topic when `isSynced === true`.
- [x] 2.3 Implement the receiving logic in `useChatNetwork` to validate incoming message `clientId`s against game presence identities before adding them to state.

## 3. UI Implementation

- [x] 3.1 Abstract the chat balloon display logic into a reusable `ChatBalloon` component capable of handling dynamic text, 10-second fade-outs, and appending messages.
- [x] 3.2 Modify the existing `OpponentIndicator` component to use `ChatBalloon` for in-game messages.
- [x] 3.3 Update `PlayerList` in the lobby to use `ChatBalloon` over player cards for lobby messages.
- [x] 3.4 Update `PlayerList` grid styling to support a 3-per-row responsive layout on mobile (< 768px).
- [x] 3.5 Modify the "UNO!" indicator to render directly over the opponent's avatar (with the existing bounce animation) instead of using the chat balloon.
- [x] 3.6 Create a `ChatInput` textarea component. Implement it as a centered overlay above the player's hand during games, and as a fixed input above the `GameSettingsPanel` in the lobby.
- [x] 3.7 Wire the `ChatInput` to `useChatNetwork` to publish messages on submit (Enter key/button click) and immediately clear the input field.

## 4. Testing

- [x] 4.1 Write component tests for `OpponentIndicator` ensuring chat balloons fade out after 10 seconds and append messages arriving within 10 seconds.
- [x] 4.2 Write component tests for the `ChatInput` to ensure the textarea clears on submission.
- [x] 4.3 Write isolated logic tests for `lib/websocket/ChatNetwork.test.ts` (mocking the WebSocket API).
- [x] 4.4 Verify cleanup logic ensures messages cannot persist across unmounts.
