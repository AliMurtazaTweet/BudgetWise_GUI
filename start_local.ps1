# Start BudgetWise Locally on Windows
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path ".\node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$backendExe = ".\backend\budgetwise_server.exe"
if (-not (Test-Path $backendExe)) {
    Write-Host "Backend executable not found: $backendExe" -ForegroundColor Red
    exit 1
}

Write-Host "Starting C++ Backend Server on port 8080..." -ForegroundColor Cyan
Start-Process -FilePath $backendExe -WorkingDirectory $PSScriptRoot -NoNewWindow

Start-Sleep -Seconds 2

Write-Host "Starting Next.js Frontend Server on port 3000..." -ForegroundColor Green
# Using 0.0.0.0 so it's accessible from other devices on your local network (e.g. your phone)
npm run dev -- -H 0.0.0.0
