## Context

The current game UI includes an UNO button control that is visible to players but not tied to any enforced gameplay outcome. This creates a mismatch between UI affordances and actual rules, and introduces dead code paths (props, callbacks, and tests) that increase maintenance cost. The change is frontend-focused and should not alter Yjs synchronization semantics, network behavior, or game-state authority.

## Goals / Non-Goals

**Goals:**
- Remove UNO button rendering from in-game board and hand UI.
- Remove UNO-button-specific code paths end-to-end (component props, handlers, helper branches, tests, and docs references).
- Preserve existing turn flow, card play, scoring, and room behavior with no protocol changes.
- Prepare the codebase for retirement of the `uno-button` capability specification.

**Non-Goals:**
- No change to UNO game rules outside removing the unused UI control.
- No changes to WebRTC/Yjs data models, awareness, or signaling.
- No redesign of player hand layout beyond what is required by button removal.

## Decisions

### 1) Remove UI entry points instead of hiding behind a feature flag
- **Decision:** Delete UNO button UI and related props/callbacks rather than gating it.
- **Rationale:** The feature is unused and has no behavior contract worth preserving; feature flags would keep dead branches alive.
- **Alternatives considered:**
  - Keep the button hidden conditionally: rejected because it preserves complexity without user value.
  - Keep button but disable interaction: rejected because it still signals a non-functional affordance.

### 2) Perform capability retirement as spec + code cleanup
- **Decision:** Treat this as retirement of `uno-button` capability and update adjacent `game-board-ui` requirements.
- **Rationale:** The proposal states complete removal; documenting retirement prevents future reintroduction via stale specs.
- **Alternatives considered:**
  - Leave `uno-button` spec in place with deprecated wording: rejected because it keeps contradictory requirements active.

### 3) Keep data/state contracts unchanged
- **Decision:** Do not modify shared game-state structures; only remove UNO-button-specific local wiring.
- **Rationale:** Limits risk and isolates change scope to presentation and local interaction plumbing.
- **Alternatives considered:**
  - Refactor broader hand interaction model in the same change: rejected to keep rollout safe and reviewable.

## Risks / Trade-offs

- **[Risk]** Hidden dependencies on UNO button props in child components could cause runtime regressions. -> **Mitigation:** Remove props incrementally and run targeted component/hook tests after each cleanup step.
- **[Risk]** Stale tests may still assert UNO controls and fail after removal. -> **Mitigation:** Update/remove UNO-specific expectations and keep behavior-focused assertions for remaining controls.
- **[Trade-off]** No fallback path to quickly re-enable UNO button. -> **Mitigation:** Rely on git history if reintroduction is needed, and only re-add with a real gameplay requirement.

## Migration Plan

1. Remove UNO button rendering and its parent-level callbacks/props from board/hand UI.
2. Remove dead utility and hook branches used only by UNO button interactions.
3. Update tests and docs to reflect the absence of UNO button controls.
4. Validate unchanged gameplay behavior through existing game-board/gameplay test suites.
5. In spec artifacts, retire `uno-button` capability and update `game-board-ui` requirements.

Rollback strategy: revert the change set restoring removed UI and wiring if regressions appear.

## Open Questions

- Should the retired `uno-button` spec be deleted or archived in-place according to repository convention for retired capabilities?
