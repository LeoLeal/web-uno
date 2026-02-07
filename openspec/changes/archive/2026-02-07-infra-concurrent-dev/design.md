## Context

Currently, the `package.json` defines separate scripts for the Next.js app (`dev`) and the signaling server (`signaling`). Developers must open two terminal tabs to run the full environment. This is a minor but repetitive friction point.

## Goals / Non-Goals

**Goals:**
- Provide a single command (`npm run dev`) that starts both the Next.js app and the signaling server.
- Ensure logs from both services are visible and distinguishable.
- Maintain the ability to run them separately if needed.

**Non-Goals:**
- Dockerizing the development environment (decided against for now to preserve HMR speed).

## Decisions

### 1. Use `concurrently`
We will use the `concurrently` npm package to run the scripts in parallel.
- **Rationale**: It is cross-platform (works on Windows/Mac/Linux), supports colored output for differentiating processes, and handles process termination gracefully.
- **Alternatives Considered**:
  - `&` operator (e.g., `npm run signaling & npm run next`): Not cross-platform, messy output.
  - `npm-run-all`: Good alternative, but `concurrently` has better output formatting features out of the box.

### 2. Script Naming
- `dev`: The new main entry point.
- `dev:next`: The underlying Next.js dev command.
- `dev:signaling`: The underlying signaling server command.
This naming convention groups the development scripts logically.

## Risks / Trade-offs

- **Log Clutter**: Interleaved logs can be hard to read.
  - **Mitigation**: Use `concurrently`'s `-c` flag to assign distinct colors (e.g., `cyan` for Next.js, `magenta` for Signaling) and `-n` to prefix lines.
