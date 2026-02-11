## ADDED Requirements

### Requirement: All modal components SHALL reside in `components/modals/`

Every modal component (`GameSettingsModal`, `HostDisconnectModal`, `JoinGameModal`, `GameAlreadyStartedModal`) SHALL be located in `components/modals/`. No modal component SHALL remain in `components/lobby/`.

#### Scenario: Modal imports resolve from the modals directory

- **WHEN** any file imports a modal component
- **THEN** the import path MUST reference `@/components/modals/<ModalName>`

#### Scenario: No behavioral changes after relocation

- **WHEN** modal components are moved to `components/modals/`
- **THEN** all existing tests MUST pass without modification to test assertions (only import paths change)
