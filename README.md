# Unified Dev Platform (Improved Starter)

This starter implements the next iteration of the unified web + mobile + API workspace. It includes error handling, minimal authentication, AI stubs, and an Electron wrapper, on top of the original collaborative editing features.

## What's inside

- `apps/web` – Next.js app with Monaco editor, Yjs sync (rooms and presence), simple login page, and QR deep‑link.
- `apps/api` – Node server providing a Yjs WebSocket endpoint, AI stub endpoint, and basic error handling middleware.
- `apps/mobile` – Expo app that joins the Yjs room and syncs text in real time.
- `apps/desktop` – Electron wrapper that loads the web client.
- `packages/editor-core` – Yjs helpers and awareness utilities.
- `packages/types` – Shared types.
- `packages/ai` – Placeholder prompt definitions.
- `packages/ui` – Shared UI components (e.g. Button).

See the original README for quick start instructions.
