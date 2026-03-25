# IronBrain HQ - Deploy Script
# Run this from PowerShell inside the "IronBrain HQ" folder in your vault.
# Requires: GitHub CLI (gh) or Git with credentials configured, Node.js, npm

# Step 1: Clean up (node_modules copied over from VM - delete and reinstall)
Write-Host "Cleaning node_modules..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npm install

# Step 2: Test build
Write-Host "Testing build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed - stop." -ForegroundColor Red; exit 1 }

# Step 3: Init git and create GitHub repo
Write-Host "Setting up Git and GitHub..." -ForegroundColor Cyan
git init
git branch -M main
git add .
git commit -m "feat: IronBrain HQ Phase 1 shell - PIN auth, Projects, Tasks, Calendar"

# Create repo on GitHub (requires gh CLI: https://cli.github.com)
gh repo create anthonymancini14-cloud/ironbrain-dashboard --public --source=. --remote=origin --push

Write-Host ""
Write-Host "DONE - repo is at: https://github.com/anthonymancini14-cloud/ironbrain-dashboard" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT: Go to https://vercel.com/anthonymancini14-clouds-projects" -ForegroundColor Yellow
Write-Host "  1. Add New Project" -ForegroundColor Yellow
Write-Host "  2. Import 'ironbrain-dashboard' from GitHub" -ForegroundColor Yellow
Write-Host "  3. Framework: Vite | Build: npm run build | Output: dist" -ForegroundColor Yellow
Write-Host "  4. Add environment variable: VITE_DASHBOARD_PIN = (your chosen PIN)" -ForegroundColor Yellow
Write-Host "  5. Deploy" -ForegroundColor Yellow
Write-Host "  6. Verify at ironbrain-dashboard.vercel.app" -ForegroundColor Yellow
