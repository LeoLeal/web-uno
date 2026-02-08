## Context

The project is named "Web Uno" but uses peer-to-peer (P2P) architecture with WebRTC and Yjs. The name doesn't communicate this unique differentiator. We're renaming to "P2P Uno" to better reflect the serverless, peer-to-peer nature.

Current occurrences of "Web Uno":

- `app/layout.tsx`: Page metadata title
- `app/room/[id]/page.tsx`: Header text in room view
- `README.md`: Project title
- `project.md`: Vision document title
- `AGENTS.md`: 3 references in coding guidelines
- `openspec/config.yaml`: Project description

## Goals / Non-Goals

**Goals:**

- Rename all user-facing and documentation references to "P2P Uno"
- Maintain consistency across the codebase

**Non-Goals:**

- Renaming the npm package name (`web-uno` stays)
- Renaming the project directory
- Modifying archived change files
- Updating any external services or URLs

## Decisions

### Keep package.json unchanged

**Rationale**: The npm package name is a technical identifier that may be referenced in deployment scripts, CI, or other tooling. Changing it introduces unnecessary risk for no user-visible benefit.

### Update openspec/config.yaml

**Rationale**: This is the canonical project description used by OpenSpec tooling. It should reflect the correct name.

## Risks / Trade-offs

- **Risk**: Mixed naming (package `web-uno`, display `P2P Uno`) could cause confusion
  → **Mitigation**: Acceptable tradeoff—package name is developer-facing only

- **Risk**: Missing an occurrence
  → **Mitigation**: Used grep to find all instances, verified list is complete
