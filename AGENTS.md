# AGENTS.md - AI Coding Agent Guidelines

> **IMPORTANT**: LLMs and AI coding agents MUST update this file whenever significant changes are made to the project architecture, conventions, or workflows. This is a living document that should evolve with the codebase.

## Project Overview

**Chord Shift** is a web application for scraping chords from Ultimate Guitar, transposing them, and arranging chord progressions. Built with modern web technologies for speed and developer experience.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Bun | 1.x |
| Framework | Next.js (App Router) | 16.x |
| UI | React | 19.x |
| Styling | Tailwind CSS + shadcn/ui | 3.x |
| State | Zustand | 5.x |
| Drag & Drop | @dnd-kit | 6.x / 10.x |
| Database | Firebase Firestore | 11.x |
| Testing | Bun Test Runner | built-in |
| Linting | ESLint (flat config) | 9.x |
| Lint Plugins | typescript-eslint, import-x, react, react-hooks | 8.x / 4.x / 7.x |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API route handlers (Next.js Route Handlers)
│   ├── chords/            # Chords page with state management
│   ├── layout.tsx         # Root layout with providers and fonts
│   └── page.tsx           # Home page (static)
├── components/            # React components
│   ├── ui/               # shadcn/ui components (auto-generated)
│   └── *.tsx             # Custom application components
├── features/              # Business logic utilities
├── lib/                   # Shared utilities (cn function)
├── services/              # External service integrations
├── store/                 # Zustand state management
├── styles/                # Global CSS with Tailwind
└── types/                 # TypeScript type definitions
```

## Code Conventions

### Imports
- **NO barrel exports (index.ts files)** - Import directly from source files
- Use path aliases: `@/` maps to `src/`
- Order imports: external libs → internal modules → relative imports
- Use `type` keyword for type-only imports

```typescript
// Good
import { useWorkspaceStore } from '@/store/workspace-store'
import type { Chord } from '@/types/chord'

// Bad - Don't use barrel exports
import { useWorkspaceStore } from '@/store'
```

### Components
- Use `'use client'` directive for interactive components
- Prefer named exports for components
- Keep components focused and single-responsibility
- Use shadcn/ui components from `@/components/ui/`

### State Management
- Global state lives in `@/store/workspace-store.ts`
- Use Zustand selectors for performance: `useWorkspaceStore((state) => state.field)`
- Actions are defined within the store, not as separate functions

### Styling
- Use Tailwind CSS classes
- Custom utilities defined in `globals.css` under `@layer utilities`
- shadcn/ui theme colors via CSS variables
- Glass morphism: `.glass` and `.glass-strong` classes

### Testing
- Test files: `test/**/*.spec.ts`
- Use Bun's test runner: `bun test`
- Test naming: `describe('functionName', () => { test('does something', ...) })`

## Key Files

| File | Purpose |
|------|---------|
| `src/store/workspace-store.ts` | Zustand store for workspace state |
| `src/types/chord.ts` | Chord-related types and constants |
| `src/types/workspace.ts` | Workspace structure types (includes optional `name` field for builders) |
| `src/services/ultimate-guitar-service.ts` | UG scraping logic |
| `src/services/firebase-service.ts` | Firebase singleton service |
| `src/features/generate-chord-info.ts` | Chord note/label generation |
| `src/features/construct-workspace.ts` | Converts UG chords to workspace |
| `src/components/sortable-builder.tsx` | Wrapper for drag-and-drop reordering of builders |
| `src/components/sortable-chord-card.tsx` | Chord card with drag-and-drop support |

## Common Tasks

### Adding a New shadcn Component
```bash
bunx shadcn@latest add <component-name>
```

### Running Tests
```bash
bun test                    # Run all tests
bun test --watch           # Watch mode
bun test path/to/file.spec.ts  # Single file
```

### Building for Production
```bash
bun run build
bun run start
```

## Known Issues & Workarounds

### Ultimate Guitar 403 Errors
The scraping service may get blocked by Cloudflare. The service includes browser-like headers but may still fail. Consider:
- Adding delays between requests
- Using a headless browser for critical scraping
- Implementing a fallback manual input

### Turbopack CSS Issues
If CSS processing fails during build, ensure:
- No `@apply` directives with non-utility classes (e.g., `@apply dark`)
- Valid CSS syntax in `globals.css`

## Environment Variables

Required for Firebase (create `.env.local`):
```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

## Deployment

Configured for Vercel with Bun runtime. See `vercel.json`:
```json
{
  "bunVersion": "1.x"
}
```

---

## LLM Instructions

When working on this codebase, AI agents should:

1. **Update this file** when making significant changes to:
   - Project structure
   - Dependencies or tech stack
   - Coding conventions
   - New patterns or abstractions
   - Known issues and solutions

2. **Follow existing patterns** - Read existing code before implementing new features

3. **Avoid over-engineering** - Keep solutions simple and focused

4. **Test changes** - Run `bun test` after modifications

5. **Use direct imports** - Never create barrel export files (index.ts)

6. **Prefer shadcn/ui** - For new UI components, check if shadcn has it first

7. **State in Zustand** - All global state should go through the workspace store

## Drag & Drop

The app uses `@dnd-kit` for drag-and-drop functionality:

- **Builder reordering**: Drag builders vertically to reorder them (via grip handle on left)
- **Chord reordering**: Drag chords horizontally within a builder to reorder (via grip handle)
- **Store actions**: `reorderBuilders(activeId, overId)` and `reorderChords(builderId, activeId, overId)`
- Uses `arrayMove` from `@dnd-kit/sortable` for immutable reordering

### Builder Naming
Builders have an optional `name` field. Click on "Chord Progression" header to edit inline.

---

## ESLint Configuration

Modern flat config (`eslint.config.mjs`) with the following rules:

**TypeScript Rules:**
- `@typescript-eslint/no-floating-promises` - Prevents unhandled promises (use `void` or `await`)
- `@typescript-eslint/consistent-type-imports` - Enforces `import type` for type-only imports
- `@typescript-eslint/no-misused-promises` - Catches promise misuse in conditionals

**Code Quality:**
- `no-trailing-spaces` - No trailing whitespace
- `no-console` - Warns on console.log (allows warn/error)
- `import-x/order` - Enforces import ordering (external → internal → relative)

Run `bun lint:fix` to auto-fix most issues.

---

*Last updated by AI agent: January 2026*
*Update reason: Updated ESLint to flat config with modern plugins, added no-floating-promises and no-trailing-spaces rules*
