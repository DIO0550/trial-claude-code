# CLAUDE.md

必ず日本語で回答してください。
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

The main project is a Next.js-based Gomoku (Five-in-a-Row) game located in `gomoku-game/`:

- **src/app/**: Next.js App Router pages - main game interface
- **src/components/**: React components (Stone component for game pieces)
- **src/types/**: TypeScript definitions (StoneColor type system)
- **src/stories/**: Storybook component development
- **src/test/**: Vitest testing setup

## Development Commands

```bash
# Primary development workflow
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint checking
npm run test         # Run Vitest tests
npm run test:watch   # Tests in watch mode
npm run storybook    # Component development

# Working directory for all commands
cd gomoku-game/
```

## Technology Stack

- **Next.js 15.3.3** with App Router and React 19
- **TypeScript** with strict mode enabled
- **Tailwind CSS v4** with custom CSS variables and dark mode
- **Vitest + React Testing Library** for testing
- **Storybook** for component development

## Code Conventions

### Component Patterns

- Function components with `JSX.Element` return type (no React.FC)
- Props interfaces defined in same file as component
- `interface` for objects, `type` for primitives/unions
- Early return patterns to reduce nesting

### Current Game Implementation

- `StoneColor` type: `"black" | "white" | null`
- Start screen with CPU difficulty selection (easy/medium/hard)
- User color selection with visual Stone previews
- Japanese language UI
- Responsive design with Tailwind utilities

### Game Specifications

- 15×15 grid Gomoku game (not yet implemented)
- Player vs CPU with strategic AI
- Win condition: 5 consecutive stones
- Black stones move first, white stones second

## Testing Setup

- Vitest with jsdom environment
- Setup file: `src/test/setup.ts`
- Path alias `@/` maps to `src/`
- React Testing Library integrated

## Development Guidelines

From project conventions:

- Single responsibility principle for components
- TDD approach for custom hooks
- Accessibility with aria attributes and semantic HTML
- Object parameters for functions with 4+ arguments
- JSDoc comments for non-obvious functions
