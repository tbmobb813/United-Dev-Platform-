# PowerShell script to set up pnpm properly in VS Code
# Run this script if you encounter pnpm issues

Write-Host "🔧 Setting up pnpm for VS Code..." -ForegroundColor Yellow

# Check if pnpm is installed
$pnpmPath = "C:\Users\$env:USERNAME\AppData\Roaming\npm\pnpm.cmd"

if (-not (Test-Path $pnpmPath)) {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Cyan
    npm install -g @pnpm/exe
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install pnpm" -ForegroundColor Red
        exit 1
    }
}

# Remove problematic alias if it exists
if (Get-Alias pnpm -ErrorAction SilentlyContinue) {
    Write-Host "🧹 Removing problematic pnpm alias..." -ForegroundColor Yellow
    Remove-Alias pnpm -Force -ErrorAction SilentlyContinue
}

# Create correct alias
Write-Host "🔗 Creating pnpm alias..." -ForegroundColor Cyan
Set-Alias pnpm $pnpmPath

# Test pnpm
Write-Host "🧪 Testing pnpm..." -ForegroundColor Cyan
$version = & pnpm --version

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ pnpm is working! Version: $version" -ForegroundColor Green
    
    # Test in current project
    Write-Host "🧪 Testing pnpm in current project..." -ForegroundColor Cyan
    Set-Location $PSScriptRoot\..
    
    $info = & pnpm --version
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ pnpm works in project directory! Version: $info" -ForegroundColor Green
        
        Write-Host "`n🎉 pnpm setup complete!" -ForegroundColor Green
        Write-Host "📋 You can now use these commands:" -ForegroundColor Cyan
        Write-Host "   pnpm install    - Install dependencies" -ForegroundColor White
        Write-Host "   pnpm dev        - Start development" -ForegroundColor White
        Write-Host "   pnpm build      - Build project" -ForegroundColor White
        Write-Host "   pnpm lint       - Run linting" -ForegroundColor White
        Write-Host "   pnpm test       - Run tests" -ForegroundColor White
        
        Write-Host "`n💡 Tip: Restart VS Code to ensure all settings take effect" -ForegroundColor Yellow
    } else {
        Write-Host "❌ pnpm alias works but failed in project directory" -ForegroundColor Red
    }
} else {
    Write-Host "❌ pnpm setup failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n📚 For more help, see: docs/devops-setup.md" -ForegroundColor Cyan