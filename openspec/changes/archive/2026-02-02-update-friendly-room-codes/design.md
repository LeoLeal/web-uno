## Context

Current Room IDs are UUIDs. We want easier IDs to improve the mobile joining experience.

## Goals / Non-Goals

**Goals:**
- Generate IDs like `Happy-Lions-42` (Adjective-PluralNoun-Number).
- Ensure sufficient randomness to avoid collisions in a decentralized system (for reasonable usage levels).

**Decisions**

### Format: Adjective-PluralNoun-Number
- **Decision**: Use 3 components: Adjective + Plural Noun + 2-digit Number.
- **Canonical Form**: Lowercase, hyphen-separated (e.g., `happy-lions-42`).
- **Display Format**: `Happy Lions [42]` (Title Case, Spaces, Brackets).
- **Input Parsing**: 
  - Normalize to lowercase.
  - Replace any sequence of non-alphanumeric characters (spaces, underscores, dots) with a single hyphen.
  - Example: `Happy Lions - 42` -> `happy-lions-42`.
- **Rationale**: High readability. Robust handling of user input styles.

### Word List Size
- **Decision**: ~50 Adjectives, ~50 Nouns.
- **Math**: 50 * 50 * 90 = 225,000 combinations.
- **Rationale**: Sufficient for ephemeral P2P rooms. If 100 people are playing worldwide, collision chance is negligible.

## Risks / Trade-offs

- **Collisions**: If two people pick `Happy-Lions-42` at the exact same moment, they will join the same room.
  - *Mitigation*: Acceptable for casual game. Players will notice unfamiliar names and create a new room. `y-webrtc` merges them seamlessly so no errors occur, just unexpected guests.
