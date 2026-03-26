# IronBrain HQ - Push Updates to GitHub (triggers Vercel auto-deploy)
# Run this from PowerShell inside the "IronBrain HQ" folder in your vault after any code changes.
# Requires: Git with credentials configured, Node.js, npm

param(
    [string]$Message = "chore: update dashboard"
)

# Step 1: Test build
Write-Host "Building..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed - stopping." -ForegroundColor Red; exit 1 }

# Step 2: Commit and push
Write-Host "Committing and pushing..." -ForegroundColor Cyan
git add src/ public/ scripts/
git commit -m $Message
git push origin main

Write-Host ""
Write-Host "Done - Vercel will auto-deploy in ~30 seconds." -ForegroundColor Green
Write-Host "Check: https://ironbrain-dashboard.vercel.app" -ForegroundColor Yellow
