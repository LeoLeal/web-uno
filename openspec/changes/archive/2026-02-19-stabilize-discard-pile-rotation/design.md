## Context

`DiscardPile` currently computes random rotation/offset values for visible cards based on pile length changes, which causes previously visible cards to visually "jump" whenever a new card is played. The change is presentation-only and must not affect shared game state (`discardPile` in Yjs), action processing, or card-play rules.

## Goals / Non-Goals

**Goals:**
- Keep transforms stable for cards while they remain in the visible discard subset.
- Assign random transform values only when a card first becomes visible.
- Prune transform history for cards that leave visibility so re-entry generates a new random transform.
- Preserve all gameplay and networking semantics.

**Non-Goals:**
- No changes to action validation/execution in `useGameEngine`.
- No changes to `discardPile` data shape or Yjs synchronization.
- No visual redesign of card sizing, depth count, or table layout.

## Decisions

### 1) Store transform history as UI-local cache keyed by `card.id`
- **Decision:** Use a local in-component cache keyed by stable card IDs for visible cards.
- **Rationale:** Keeps visual state independent from gameplay state while preserving per-card continuity.
- **Alternatives considered:**
  - Recompute by `useMemo([cards.length])`: rejected due to jitter.
  - Store transforms on card objects/shared state: rejected because it pollutes game data with presentation concerns.

### 2) Use visible-only pruning
- **Decision:** Keep transforms only for currently visible cards (last N cards shown by `DiscardPile`).
- **Rationale:** Matches desired behavior: cards that leave and later re-enter get new random transforms.
- **Alternatives considered:**
  - Long-lived/LRU cache: rejected because it would preserve old transforms across re-entry, which is explicitly unwanted.

### 3) Keep randomness isolated from rule evaluation
- **Decision:** Apply transform logic only in `DiscardPile` render path; do not touch hooks that compute legality, turn, or side effects.
- **Rationale:** Guarantees no chance of retriggering action-card logic or affecting rule constraints.
- **Alternatives considered:**
  - Shared helper in game logic layer: rejected to avoid coupling visuals with engine concerns.

### 4) Increase rotation range for visible discard cards
- **Decision:** Use a wider random rotation range of `+/-30` degrees (instead of `+/-10`) for generated discard transforms.
- **Rationale:** Improves visual variety while keeping stable per-card transform history during visibility.
- **Alternatives considered:**
  - Keep `+/-10`: rejected as too subtle for desired visual effect.

## Risks / Trade-offs

- **[Risk]** StrictMode/dev re-mounts can visually re-seed transforms unexpectedly. -> **Mitigation:** Keep expected behavior scoped to mount lifecycle and validate in production-like test runs.
- **[Risk]** Keying assumptions break if card IDs are not unique/stable. -> **Mitigation:** Rely on existing deck ID guarantees and preserve `card.id` identity semantics.
- **[Trade-off]** Re-entered cards intentionally lose prior transform history. -> **Mitigation:** This is accepted and aligns with requested visible-only pruning behavior.

## Migration Plan

1. Refactor `DiscardPile` transform assignment to use per-visible-card ID cache with visible-only pruning.
2. Add/update tests verifying stability of currently visible cards and regeneration on re-entry.
3. Run targeted component tests plus full lint/test/type checks.

Rollback strategy: revert `DiscardPile` transform caching changes to previous behavior if regressions appear.

## Open Questions

- (none)
