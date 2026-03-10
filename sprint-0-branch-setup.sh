#!/bin/bash
# ============================================================
# UDP Sprint 0: Pivot Branch Setup
# Run this from the root of your United-Dev-Platform- repo
# ============================================================

set -e

echo ""
echo "========================================"
echo "  UDP Sprint 0: Setting Up The Pivot"
echo "========================================"
echo ""

# --- Step 1: Ensure we're on main and up to date ---
echo "[1/5] Checking out main and pulling latest..."
git checkout main
git pull origin main
echo "  ✓ On main, up to date"
echo ""

# --- Step 2: Tag the current IDE state ---
echo "[2/5] Tagging current state as v0.1-ide-archive..."
git tag -a v0.1-ide-archive -m "Archive: Last commit of the IDE-focused UDP before pivot to workflow tool"
git push origin v0.1-ide-archive
echo "  ✓ Tagged v0.1-ide-archive (you can always return to this)"
echo ""

# --- Step 3: Create the pivot branch ---
echo "[3/5] Creating pivot/workflow-tool branch..."
git checkout -b pivot/workflow-tool
git push -u origin pivot/workflow-tool
echo "  ✓ Branch pivot/workflow-tool created and pushed"
echo ""

# --- Step 4: Create the archive directory ---
echo "[4/5] Creating archive/ directory structure..."
mkdir -p archive
cat > archive/README.md << 'ARCHIVEEOF'
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
ARCHIVEEOF
echo "  ✓ archive/ directory created with README"
echo ""

# --- Step 5: Summary ---
echo "[5/5] Sprint 0 branch setup complete!"
echo ""
echo "========================================"
echo "  What you have now:"
echo "========================================"
echo ""
echo "  Branch:  pivot/workflow-tool (active)"
echo "  Tag:     v0.1-ide-archive (safety net)"
echo ""
echo "  Next steps:"
echo "  1. Send the developer validation survey (see survey.md)"
echo "  2. Begin Sprint 1: run sprint-1-restructure.sh"
echo ""
echo "========================================"