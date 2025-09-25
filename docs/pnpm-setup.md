# pnpm Setup Guide for VS Code

## ✅ **pnpm is Now Working!**

Your pnpm installation has been successfully configured for VS Code. Here's what was fixed and how
to maintain it.

## 🔍 **What Was the Issue?**

1. **Missing Administrator Privileges**: `corepack enable` requires admin rights to create symlinks
   in Node.js directory
2. **Broken PowerShell Alias**: PowerShell had an alias redirecting `pnpm` to `npx pnpm` which
   doesn't work
3. **PATH Issues**: npm global directory wasn't properly in the system PATH
4. **Installation Method**: The standard `pnpm` package had corrupted installation files

## 🔧 **What Was Fixed**

### 1. **Installed Standalone pnpm**

```bash
npm install -g @pnpm/exe
```

This installs the standalone pnpm executable that doesn't require corepack.

### 2. **Fixed PowerShell Alias**

```powershell
Remove-Alias pnpm -Force
Set-Alias pnpm "C:\Users\jsnni\AppData\Roaming\npm\pnpm.cmd"
```

### 3. **Updated VS Code Configuration**

- Added npm global path to VS Code terminal environment
- Updated tasks.json to include proper PATH
- Configured settings.json for pnpm package manager

## 🚀 **Testing Your Setup**

Run these commands to verify everything works:

```bash
# Check pnpm version
pnpm --version

# List project dependencies
pnpm list --depth=0

# Validate environment
pnpm validate-env

# Test development mode (dry run)
pnpm --help
```

## 📁 **Key Files Modified**

- **`.vscode/settings.json`**: Added terminal environment PATH
- **`.vscode/tasks.json`**: Added PATH to task options
- **`scripts/setup-pnpm.ps1`**: Created setup script for future use

## 🔄 **If Issues Persist**

### **Option 1: Run Setup Script**

```powershell
.\scripts\setup-pnpm.ps1
```

### **Option 2: Manual Fix**

```powershell
# Remove problematic alias
Remove-Alias pnpm -Force -ErrorAction SilentlyContinue

# Create correct alias
Set-Alias pnpm "C:\Users\$env:USERNAME\AppData\Roaming\npm\pnpm.cmd"

# Test
pnpm --version
```

### **Option 3: Use Full Path (Always Works)**

```powershell
& "C:\Users\jsnni\AppData\Roaming\npm\pnpm.cmd" --version
```

## 🎯 **Available Commands**

Now that pnpm is working, you can use all the project scripts:

```bash
# Development
pnpm dev                 # Start all services
pnpm dev:web            # Start web app only
pnpm dev:api            # Start API only
pnpm dev:mobile         # Start mobile app

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix          # Fix ESLint issues
pnpm format            # Format with Prettier
pnpm type-check        # TypeScript type checking

# Building & Testing
pnpm build             # Build all projects
pnpm test              # Run tests
pnpm check             # Run all quality checks

# Validation
pnpm validate-env      # Validate environment variables
pnpm validate-devops   # Validate DevOps setup

# Maintenance
pnpm install           # Install dependencies
pnpm clean             # Clean build artifacts
pnpm reset             # Clean and reinstall
```

## 🔧 **VS Code Integration**

### **Tasks Available**

- **Ctrl+Shift+P** → "Tasks: Run Task"
- Available tasks: Install Dependencies, Build All, Lint All, etc.

### **Debugging**

- **F5** → Start debugging
- Available configurations: Debug Web App, Debug API Server, etc.

### **Terminal**

- pnpm should work directly in VS Code integrated terminal
- If not, restart VS Code after running the setup script

## 🌟 **Best Practices**

1. **Always use pnpm** instead of npm for this project
2. **Run `pnpm install`** after pulling changes
3. **Use `pnpm validate-env`** before building
4. **Run `pnpm check`** before committing code
5. **Use VS Code tasks** for common operations

## 🆘 **Troubleshooting**

### **"pnpm not recognized"**

```powershell
.\scripts\setup-pnpm.ps1
```

### **Permission denied errors**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **VS Code not recognizing pnpm**

1. Close VS Code completely
2. Run setup script
3. Restart VS Code

### **Still having issues?**

1. Check the full DevOps setup guide: `docs/devops-setup.md`
2. Ensure Node.js is properly installed: `node --version`
3. Verify npm is working: `npm --version`

## 📞 **Getting Help**

- **Documentation**: `docs/devops-setup.md`
- **Scripts**: `scripts/setup-pnpm.ps1`
- **VS Code Settings**: `.vscode/settings.json`

Your development environment is now fully configured! 🎉
