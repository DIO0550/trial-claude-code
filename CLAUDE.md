# CLAUDE.md

必ず日本語で回答してください。
npx コマンドは使わないでください。

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

### Programming Patterns

- **No classes**: Use function-based approaches and factory functions instead of ES6 classes
- Prefer functional programming patterns over object-oriented patterns
- Use factory functions for creating objects with behavior
- Leverage TypeScript interfaces for type contracts

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

### ディレクトリ構造

```text
/
├ next.config.js
├ tsconfig.json
├ package.json
├ .env.example
├ prisma/                  # Prisma管理のDBスキーマ
│  └ schema.prisma
├ public/
│  └ swagger/             # Swagger UI静的ファイル
│     └ swagger.json
└ src/
   ├ app/                 # Next.js App Routerルート
   │  ├ api/              # APIエンドポイント（REST/GraphQL/OpenAPI）
   │  │  ├ graphql/
   │  │  │  └ route.ts
   │  │  ├ openapi/
   │  │  │  └ route.ts
   │  │  └ …               # 追加のREST APIハンドラ（route.ts）
   │  ├ layout.tsx
   │  └ page.tsx           # トップレベルページ
   ├ components/           # UIコンポーネント
   │  ├ elements/
   │  │  └ buttons/
   │  │     └ button.tsx
   │  └ layouts/
   │     └ headers/
   │        └ header.tsx
   ├ features/             # ドメイン別機能モジュール
   │  └ cpu/
   │     ├ components/
   │     ├ hooks/
   │     ├ types/
   │     └ utils/
   ├ hooks/                # 全体共通カスタムフック
   ├ libs/                 # 共有ライブラリ（GraphQL/OpenAPIクライアント）
   │  ├ graphql/
   │  │  ├ schema.ts
   │  │  └ resolvers.ts
   │  └ openapi/
   ├ types/                # グローバル型定義
   └ utils/                # 共有ユーティリティ関数
```

## Reference Documentation

プロジェクトの開発において、以下のフォルダ内の markdown ファイルを参考にしてください：

**IMPORTANT: Claude Code起動時に必ず以下のマークダウンファイルを読み込んで基本ルールを確認すること**

- **react/**: React 開発に関するベストプラクティスやプロンプトファイル

  - `component.prompt.md`: コンポーネント作成ガイド
  - `custom-hook.prompt.md`: カスタムフック開発ガイド
  - `tdd.prompt.md`: TDD 開発手法
  - `vitest.prompt.md`: Vitest テストガイド
  - `standard.prompt.md`: 標準的な開発パターン
  - `comment.prompt.md`: コメント記述ガイド
  - `copilot-instructions.md`: Copilot 使用時の指示

- **general/**: 一般的な開発ガイドライン
  - `commit.prompt.md`: コミットメッセージのガイド

### 必須読み込みファイル

セッション開始時に必ず以下のファイルを読み込んで開発ルールを確認すること：

```
react/component.prompt.md
react/custom-hook.prompt.md  
react/tdd.prompt.md
react/vitest.prompt.md
react/standard.prompt.md
react/comment.prompt.md
general/commit.prompt.md
```
