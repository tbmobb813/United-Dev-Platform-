# Archived UDP Components

These packages and apps were part of the original UDP IDE project (v0.1).
They are preserved here for reference during the pivot to the cross-platform
workflow tool architecture.

## What's here:
- **web/** — Original Next.js web IDE with Monaco editor
- **desktop/** — Electron desktop wrapper
- **ui-web/** — Web UI component library (Button, Card, Modal, etc.)
- **server-utils/** — NextAuth server utilities
- **auth/** — JWT/bcrypt auth package (replaced by GitHub Device Code Grant)
- **worker/** — Empty worker placeholder

## When to look here:
- Need to reference how Monaco + Yjs was integrated → check web/
- Need to salvage a UI component for the VS Code extension → check ui-web/
- Need to understand the old auth flow → check auth/

## What NOT to do:
- Don't add archive/ back to pnpm-workspace.yaml
- Don't import from archived packages in active code
- Don't delete this — it's your reference library
