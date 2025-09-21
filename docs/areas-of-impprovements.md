## Here are some low‑effort improvements that would polish the current starter without diving into heavy feature work:

Add a .gitignore – the repository currently doesn’t include one, so committing can bring in node_modules, build outputs and Expo artefacts. A simple .gitignore with rules for node_modules, .next, dist, .expo, ios and android folders will keep the repo clean and avoid future merge conflicts.

Linting and formatting – there are no ESLint/Prettier scripts or configuration in the monorepo. Adding a shared ESLint config at the root and a lint script in package.json would catch errors early and keep code style consistent. This is especially useful when multiple packages (web, api, mobile) live together
GitHub

Presence indicator for collaboration – the collaborative editor in apps/web already syncs text via Yjs GitHub, but doesn’t show who else is editing. Yjs provides an awareness API that can broadcast users’ cursors and names. Using y-protocols/awareness to track remote cursors and display a coloured caret for each collaborator is a small but meaningful UX improvement.

Support multiple documents – right now the editor uses a hard‑coded room (room-demo) and a single Y.Text object GitHub. Introducing a room query parameter (e.g. ?room=mydoc) and generating a separate Yjs Doc per room will let users work on multiple files without copying code. Persisting the document in IndexedDB (y-indexeddb) is a small change that allows offline editing.

Wire the mobile editor – the Expo app parses the deep‑link parameters but only renders a placeholder GitHub. Integrating a basic text editor (for example, react-native-monaco or a lightweight Markdown editor) and connecting it to the same Yjs room using the existing createCollabDoc helper GitHub will demonstrate the mobile‑extended flow with minimal coding.

Shared UI components – currently there’s no packages/ui package. Creating one with a few simple, styled components (e.g. buttons, input fields) and reusing them across apps/web and apps/mobile will unify look and feel without much overhead.

Basic cross‑platform graph endpoint – The `packages/types` directory defines `ProjectGraph` and `CrossPlatformLink` types, but there is currently no API to generate or serve this data. You can add a simple Node.js script in `apps/api` that uses `ts-morph` to traverse the codebase and build a `ProjectGraph`, focusing initially on web and React Native files. This incremental approach lays the groundwork for future parity analysis between platforms and can be expanded over time.

Environment configuration – Move hardcoded values such as `ws://localhost:3030` in the web app and Expo scheme settings in `app.json` to environment variables or a shared config file. This makes it easier to adjust settings for different deployments and improves maintainability.

Each of these suggestions delivers immediate benefits—cleaner commits, better collaboration cues, and reusable UI—without requiring heavy infrastructure or architectural changes.
