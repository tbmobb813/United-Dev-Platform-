# Yjs Singleton Implementation

## Overview

This package implements a centralized Yjs singleton pattern to prevent duplicate Yjs imports and the
"Yjs was already imported" error.

## Architecture

### Core Components

1. **yjs-singleton.ts** - Central Yjs export point
   - All Yjs imports should go through this file
   - Ensures a single Yjs instance across the application
   - Re-exports all Yjs types and classes

2. **index.ts** - Package entry point
   - Exports DocumentManager and other core functionality
   - Exports Y as the singleton instance
   - Imports Yjs through yjs-singleton.ts

3. **Webpack Configuration** (apps/web/next.config.mjs)
   - Aliases all yjs imports to resolve to the same module
   - Chunks Yjs packages into a single vendor bundle
   - Externalizes Yjs on server-side to prevent duplication

## Usage

### In Application Code

```typescript
// ✅ CORRECT - Import from @udp/editor-core
import { Y, DocumentManager } from "@udp/editor-core";

// ❌ WRONG - Don't import yjs directly
import * as Y from "yjs";
```

### In editor-core Package

```typescript
// ✅ CORRECT - Import from local singleton
import * as Y from "./yjs-singleton";

// ❌ WRONG - Don't import yjs directly
import * as Y from "yjs";
```

## Build-Time Warnings

You may still see "Yjs was already imported" warnings during Next.js static site generation (SSG).
This is expected because:

1. Next.js runs page generation in multiple worker processes
2. Each worker loads its own Yjs instance for SSG
3. The warnings are precautionary and don't affect runtime behavior

These warnings are documented in the [Yjs GitHub issues](https://github.com/yjs/yjs/issues/438) and
are safe to ignore if:

- You're not passing Yjs documents between processes
- Runtime (browser/server) works correctly
- The build completes successfully

## Version Management

All Yjs-related packages are locked to specific versions in the root `package.json`:

```json
{
  "pnpm": {
    "overrides": {
      "yjs": "13.6.27",
      "y-protocols": "1.0.6",
      "y-websocket": "1.5.4"
    }
  }
}
```

The `@udp/editor-core` package must specify matching versions in its `peerDependencies` and
`devDependencies`.

## Troubleshooting

### Runtime Errors

If you see Yjs errors at runtime (not build time):

1. Check that all imports use `@udp/editor-core` or the local singleton
2. Verify no code is importing `yjs` directly
3. Check that all Yjs versions match the root overrides

### Build Errors

If the build fails with Yjs errors:

1. Run `pnpm install` to ensure lock file is updated
2. Clear Next.js cache: `rm -rf apps/web/.next`
3. Rebuild: `pnpm turbo build --filter=@udp/web --force`

## Testing

The singleton pattern is tested in:

- `packages/editor-core/__tests__/core/DocumentManager.test.ts`
- Integration tests in web and mobile apps

## References

- [Yjs Documentation](https://docs.yjs.dev/)
- [Yjs Duplicate Import Issue](https://github.com/yjs/yjs/issues/438)
- [Next.js Transpiling Packages](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)
