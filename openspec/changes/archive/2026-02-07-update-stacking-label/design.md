## Context

Currently, toggle switches in the Game Settings panel show a generic description or just "Enabled/Disabled". For the "Stacking" rule, "Disabled" is ambiguous (does it mean standard rules? or strictly no stacking?). Explicitly saying "No stacking" removes ambiguity.

## Goals / Non-Goals

**Goals:**
- Update the UI text for the Stacking rule toggle to display "No stacking" when the switch is OFF.

## Decisions

### 1. Conditional Label Rendering
We will modify `GameSettingsPanel.tsx`.
- Find the toggle for stacking.
- Change the description text logic to be conditional based on the boolean value: `value ? "Stack +2 and +4 cards" : "No stacking"`.

## Risks / Trade-offs

- None. purely cosmetic.
