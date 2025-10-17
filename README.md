# United Dev Platform (UDP)

<<<<<<< HEAD
This starter implements the next iteration of the unified web + mobile + API
workspace. It includes error handling, minimal authentication, AI stubs, and an
Electron wrapper, on top of the original collaborative editing features.
=======
Unified web, mobile, and AI development environment. This monorepo provides
real-time collaborative editing, cross-platform support, and a foundation for
advanced AI and plugin features.
>>>>>>> origin/main

## Architecture Overview

<<<<<<< HEAD
- `apps/web` – Next.js app with Monaco editor, Yjs sync (rooms and presence),
  simple login page, and QR deep‑link.
- `apps/api` – Node server providing a Yjs WebSocket endpoint, AI stub endpoint,
  and basic error handling middleware.
- `apps/mobile` – Expo app that joins the Yjs room and syncs text in real time.
- `apps/desktop` – Electron wrapper that loads the web client.
- `packages/editor-core` – Yjs helpers and awareness utilities.
- `packages/types` – Shared types.
- `packages/ai` – Placeholder prompt definitions.
- `packages/ui` – Shared UI components (e.g. Button).
=======
**Apps:**
>>>>>>> origin/main

- `apps/web`: Next.js app with Monaco editor, Yjs sync (rooms/presence), login,
  QR deep-link.
- `apps/api`: Node.js/Express server with Yjs WebSocket endpoint, AI stub, error
  handling.
- `apps/mobile`: Expo React Native app for real-time Yjs sync and collaborative
  editing.
- `apps/desktop`: Electron wrapper for the web client.

**Packages:**

- `packages/editor-core`: Yjs helpers, awareness utilities, DocumentManager,
  presence system.
- `packages/types`: Shared TypeScript types.
- `packages/ai`: AI prompt definitions and stubs.
- `packages/ui`: Shared UI components (Button, Card, PresenceIndicator, etc.).
- `packages/ui-native`: Native UI components for mobile.
- `packages/db`: Prisma client and database helpers.
- `packages/config`: Centralized configuration management.
- `packages/git`: Git integration (planned).
- `packages/filesystem`: File system backend and utilities.
- `packages/logger`: Logging utilities.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in the project root.
   - Edit `.env` and set secure values for `NEXTAUTH_SECRET`, `DATABASE_URL`,
     and provider keys.
   - See [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) for details.
3. **Run development servers:**
   - Web: `pnpm dev --filter @udp/web`
   - API: `pnpm dev --filter @udp/api`
   - Mobile: `pnpm start --filter @udp/mobile`
   - Desktop: See Electron docs in `apps/desktop`.

## Environment Variables

See [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) for setup and best practices.
Do not commit `.env` files.

## Testing & CI

- Lint/typecheck scripts are present in most packages.
- Test coverage is minimal; add test folders and scripts as needed.
- Recommended: Use Jest for web/editor-core/ui/types, and Detox/React Native
  Testing Library for mobile.
- CI should run lint, typecheck, and tests for all packages. See Turbo build
  system docs for configuration.

## Known Workarounds & Issues

- **Yjs Duplication in Production Bundles:**
  - In some production builds, a second copy of Yjs may be inlined due to nested
    dependencies. See build config and package aliasing strategies for
    mitigation. Only one runtime instance should exist for correct collaborative
    editing.
- **Authentication:** Basic localStorage implementation; full auth system
  planned.
- **Git Integration:** Referenced in docs, not yet implemented.

## Strategic Docs & Roadmap

- [Platform Development Strategy](docs/platform_development_strategy.md)
- [Strategic Roadmap](docs/strategic-roadmap.md)

## Milestones & Next Steps

- See [Strategic Roadmap](docs/strategic-roadmap.md) for priorities, KPIs, and
  implementation plan.
- Immediate focus: Stabilize core features, expand test coverage, and improve CI
  pipeline.
