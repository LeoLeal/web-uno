## 1. User-Facing Text

- [x] 1.1 Update page metadata title in `app/layout.tsx` ("Web Uno P2P" → "P2P Uno")
- [x] 1.2 Update header text in `app/room/[id]/page.tsx` ("Web Uno" → "P2P Uno")
- [x] 1.3 Update Logo component in `components/ui/Logo.tsx` ("WEB UN" → "P2P UN")

## 2. Documentation

- [x] 2.1 Update README.md title ("# Web Uno" → "# P2P Uno")
- [x] 2.2 Update project.md title ("# Web Uno" → "# P2P Uno")
- [x] 2.3 Update AGENTS.md - all 3 references to "Web Uno" → "P2P Uno"

## 3. Configuration

- [x] 3.1 Update openspec/config.yaml project description

## 4. Tests & Specs

- [x] 4.1 Update Logo.test.tsx ("WEB UN" → "P2P UN")
- [x] 4.2 Update e2e/homepage.spec.ts (3 occurrences)
- [x] 4.3 Update openspec/specs/homepage-design/spec.md

## 5. Verification

- [x] 5.1 Run grep to confirm no remaining "Web Uno" / "WEB UN" references
- [x] 5.2 Run Logo unit tests - Passed ✓
- [x] 5.3 Run type check (`tsc --noEmit`) - Passed ✓
