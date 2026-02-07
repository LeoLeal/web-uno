## Context

The `<dialog>` element in browsers (especially Chrome/Edge) often displays a default focus ring when opened programmatically if focus is not moved to a child element. The `HostDisconnectModal` triggers this because it doesn't autofocus an input like `JoinGameModal` does.

## Goals / Non-Goals

**Goals:**
- Remove the visible focus ring from `dialog.modal`.
- Maintain accessibility (focus logic remains, just visual outline on the container is removed).

## Decisions

### 1. Global CSS Reset
We will apply `outline: none` to `dialog.modal` in `app/globals.css`.
- **Rationale**: This is a consistent fix for all modals in the application.

## Risks / Trade-offs

- **Accessibility**: Removing focus rings can harm accessibility. However, for a modal container, the ring is visual noise. Focus usually moves to content or specific actions. Since we are managing focus (trap), removing the container outline is acceptable standard practice for custom modals.
