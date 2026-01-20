# AGENTS.md - Web Uno Multiplayer Game

This document provides guidelines for AI agents working on the Web Uno multiplayer game project.

## Project Overview
Web Uno is a multiplayer card game implementation built as a modern web application using **spec-driven development**. All features and components are thoroughly specified in the `specs/` directory before implementation.

### Technology Stack
- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with emotion/styled-components
- **State Management**: React Context API with hooks
- **P2P Communication**: WebRTC with Yjs CRDTs for multiplayer gameplay
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Build Tool**: Vite (via Next.js)

### Development Workflow
1. **Review Specs**: Check the `specs/` directory for existing specifications
2. **Create/Update Specs**: Use the spec template for new features or updates
3. **Implement**: Build according to approved specifications
4. **Test & Validate**: Ensure implementation meets all acceptance criteria
5. **Archive**: Move completed specs to `specs/_archive/`

### Key Resources
- **[📁 specs/](specs/)** - Feature and component specifications
- **[📝 Spec Template](specs/templates/spec-template.md)** - Template for creating specifications

## Build System & Commands

### Development Server
```bash
npm run dev        # Start development server with hot reload
npm run build      # Production build
npm run preview    # Preview production build locally
```

### Testing
```bash
npm test           # Run all tests
npm run test:unit  # Run unit tests only
npm run test:e2e   # Run end-to-end tests
npm run test:ci    # Run tests in CI mode (no watch)

# Run specific test file
npm test -- path/to/test.spec.ts

# Run tests for specific component/function
npm test -- --grep "GameLogic"
```

### Code Quality
```bash
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix ESLint issues
npm run typecheck  # TypeScript type checking
npm run format     # Format code with Prettier
```

### Additional Commands
```bash
npm run clean      # Clean build artifacts
npm run serve      # Serve built application
```

See [Coding Standards](specs/coding-standards.md) for detailed code style guidelines.

## Tooling Configuration

### ESLint Configuration
- Extends recommended rules for TypeScript and React
- Custom rules for game-specific patterns
- Pre-commit hooks enforce code quality

### Prettier Configuration
- Consistent formatting across the codebase
- Integrated with ESLint for seamless development experience

### TypeScript Configuration
- Strict mode enabled
- Path mapping for clean imports
- Declaration files generated for library usage

## Deployment

### Build Process
1. Run type checking: `npm run typecheck`
2. Run linting: `npm run lint`
3. Run tests: `npm test`
4. Build production bundle: `npm run build`

### Environment Variables
- Use `.env` files for environment-specific configuration
- Never commit secrets to repository
- Use `VITE_` prefix for client-side environment variables

## Additional Resources

- [Uno Game Rules](https://en.wikipedia.org/wiki/Uno_(card_game))
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

*This document should be updated as the project evolves and new patterns emerge.*