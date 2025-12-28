# CheezyBite Dev Environment Cleanup Script
# Removes stale lock files and kills processes on ports 3000 and 4000

Write-Host "🧹 Cleaning development environment..." -ForegroundColor Cyan

# Remove Next.js lock file if it exists
if (Test-Path ".next\dev\lock") {
    Remove-Item ".next\dev\lock" -Force
    Write-Host "✅ Removed .next/dev/lock" -ForegroundColor Green
}

# Clear corrupted Next.js cache (fixes Turbopack errors)
if (Test-Path ".next\cache") {
    try {
        Remove-Item ".next\cache" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Cleared Next.js cache" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not clear cache (may be locked)" -ForegroundColor Yellow
    }
}

# Kill processes on ports 3000 and 4000 using multiple methods
$ports = @(3000, 4000)
foreach ($port in $ports) {
    # Method 1: Try Get-NetTCPConnection (faster, modern)
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            $connections | ForEach-Object {
                $processId = $_.OwningProcess
                try {
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                    Write-Host "✅ Killed process on port $port (PID: $processId)" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️  Could not kill PID: $processId" -ForegroundColor Yellow
                }
            }
        }
    } catch {
        # Continue to Method 2
    }
    
    # Method 2: Use netstat as fallback (works in all scenarios)
    try {
        $netstatOutput = netstat -ano | Select-String ":$port\s" | Select-String "LISTENING"
        if ($netstatOutput) {
            $netstatOutput | ForEach-Object {
                $line = $_.ToString().Trim()
                # Extract PID from the last column
                if ($line -match '\s+(\d+)\s*$') {
                    $processId = $matches[1]
                    try {
                        Stop-Process -Id $processId -Force -ErrorAction Stop
                        Write-Host "✅ Killed process on port $port (PID: $processId) [netstat]" -ForegroundColor Green
                    } catch {
                        # Already killed or access denied
                    }
                }
            }
        }
    } catch {
        # Port not in use
    }
}

Write-Host "✨ Dev environment cleaned!" -ForegroundColor Green
