# Read the vercel.json file
$vercelConfig = Get-Content -Path "vercel.json" -Raw | ConvertFrom-Json

# Update the buildCommand
$vercelConfig.buildCommand = "npm run vercel-build"

# Save the updated config back to vercel.json
$vercelConfig | ConvertTo-Json -Depth 10 | Set-Content -Path "vercel.json"

Write-Host "Updated vercel.json with new buildCommand" 