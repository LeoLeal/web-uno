## 1. Network Infrastructure

- [ ] 1.1 Create `lib/websocket/ChatNetwork.ts` to manage the WebSocket connection to the signaling server and pub/sub messaging for a given room.

## 2. React Integration

- [ ] 2.1 Create the `useChatNetwork(roomId, gameClientId)` hook to integrate the custom WebSocket network into the React lifecycle.
- [ ] 2.2 Ensure the hook subscribes to the `[room-id]-chat` topic when `isSynced === true`.
- [ ] 2.3 Implement the receiving logic in `useChatNetwork` to validate incoming message `clientId`s against game presence identities before adding them to state.

## 3. UI Implementation

- [ ] 3.1 Modify the existing `OpponentIndicator` component (or abstract its balloon logic) to accept dynamic chat text strings and integrate a configurable 10-second fade-out timer per message.
- [ ] 3.2 Update `OpponentIndicator` to append new messages to an existing balloon if they arrive within 10 seconds of the previous message.
- [ ] 3.3 Modify the "UNO!" indicator to render directly over the opponent's avatar (with the existing bounce animation) instead of using the chat balloon.
- [ ] 3.4 Create a centered `ChatInput` textarea component, positioned above the player's hand and "Your Turn!" label.
- [ ] 3.5 Wire the `ChatInput` to `useChatNetwork` to publish messages on submit (Enter key/button click) and immediately clear the input field.

## 4. Testing

- [ ] 4.1 Write component tests for `OpponentIndicator` ensuring chat balloons fade out after 10 seconds and append messages arriving within 10 seconds.
- [ ] 4.2 Write component tests for the `ChatInput` to ensure the textarea clears on submission.
- [ ] 4.3 Write isolated logic tests for `lib/websocket/ChatNetwork.test.ts` (mocking the WebSocket API).
- [ ] 4.4 Verify cleanup logic ensures messages cannot persist across unmounts.
