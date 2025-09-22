# Package Manager Setup Guide

## Issue: pnpm not in PowerShell PATH

The project uses pnpm@9.0.0 as specified in package.json, but pnpm may not be available directly in PowerShell after global installation.

## Solution Options

### Option 1: Use `npx pnpm` (Recommended for now)

Always prefix pnpm commands with npx:

```powershell
# Instead of: pnpm install
npx pnpm install

# Instead of: pnpm add package-name
npx pnpm add package-name

# Instead of: pnpm add package-name --filter workspace-name
npx pnpm add package-name --filter workspace-name
```

### Option 2: Add pnpm to PATH manually

1. Find pnpm installation location:

   ```powershell
   npm list -g pnpm
   ```

2. Add the npm global modules path to your system PATH environment variable
3. Restart PowerShell

### Option 3: Use npm with workspace support

For simple operations, npm can work with pnpm workspaces:

```powershell
# In root directory
npm install

# In specific workspace (navigate to folder first)
cd apps/mobile
npm install package-name
```

## Current Status

- ✅ pnpm workspace is properly configured
- ✅ All dependencies installed successfully with `npx pnpm install`
- ✅ Code editor package added to mobile app: `@rivascva/react-native-code-editor`
- ⚠️ Use `npx pnpm` prefix for all pnpm commands in PowerShell

## Workspace Commands

```powershell
# Install all dependencies
npx pnpm install

# Add dependency to specific app
npx pnpm add package-name --filter @udp/mobile
npx pnpm add package-name --filter @udp/web

# Run scripts in specific workspace
npx pnpm run dev --filter @udp/mobile
npx pnpm run build --filter @udp/web

# Run scripts in all workspaces
npx pnpm run dev
npx pnpm run build
```

## Recommendation

Continue using `npx pnpm` for consistency and reliability. The workspace setup is working correctly, just needs the npx prefix in PowerShell environments.
