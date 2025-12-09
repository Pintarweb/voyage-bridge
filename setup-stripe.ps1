$ErrorActionPreference = "Stop"

Write-Host "Downloading Stripe CLI..."
$url = "https://github.com/stripe/stripe-cli/releases/download/v1.21.3/stripe_1.21.3_windows_x86_64.zip"
$zipFile = "stripe.zip"
$exeFile = "stripe.exe"

Invoke-WebRequest -Uri $url -OutFile $zipFile

Write-Host "Extracting Stripe CLI..."
Expand-Archive -Path $zipFile -DestinationPath . -Force

if (Test-Path $exeFile) {
    Write-Host "Stripe CLI installed successfully!"
    Write-Host "You can now run:"
    Write-Host "  .\stripe.exe login"
    Write-Host "  .\stripe.exe listen --forward-to localhost:3000/api/stripe-webhook"
} else {
    Write-Error "Extraction failed. stripe.exe not found."
}

Remove-Item $zipFile
