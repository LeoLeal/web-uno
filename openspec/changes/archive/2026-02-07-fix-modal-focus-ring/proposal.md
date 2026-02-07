## Why

The Host Disconnect modal displays an unwanted visual border (focus ring) when opened, detracting from the polished Card Table aesthetic. This occurs because the native `<dialog>` element receives focus but lacks an `outline: none` style reset.

## What Changes

- Update `app/globals.css` to remove the default outline on `dialog.modal`.

## Capabilities

### New Capabilities
<!-- Capabilities being introduced. Replace <name> with kebab-case identifier (e.g., user-auth, data-export, api-rate-limiting). Each creates specs/<name>/spec.md -->

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- `app/globals.css`: Styling for `dialog.modal`.
