# Unified Dev Platform (Starter Monorepo)

Opinionated starter for a unified web + mobile + API workspace with room for
AI features and a mobile-extended workflow.

## What's inside

- `apps/web` – Next.js starter (PWA-ready)
- `apps/api` – Node WebSocket server for Yjs (real-time sync) + simple REST
- `apps/mobile` – Expo (React Native) starter with deep-link placeholder
- `packages/editor-core` – Yjs helper (createCollabDoc)
- `packages/types` – Shared types
- `packages/ai` – Prompt & tool placeholders
- Turborepo + pnpm workspaces

## Quick start

```bash
pnpm install

# in one terminal
pnpm --filter @udp/api dev

# in another terminal
pnpm --filter @udp/web dev

# (optional) mobile
pnpm --filter @udp/mobile start
```

### Notes

- This is a **minimal** boilerplate to unblock repo creation. You can swap `apps/api`
  to NestJS later and expand AI features in `packages/ai`.
- The API includes a Yjs websocket endpoint for collaborative editing/sync.
- The web app includes a basic page and a placeholder for QR handoff.
