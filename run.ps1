Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  FINBOT AI — DIGITAL FINANCIAL LITERACY CHATBOT" -ForegroundColor Yellow
Write-Host "  Powered by IBM Watsonx.ai Granite Models" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting FinBot AI application on http://localhost:5000 ..." -ForegroundColor White

Set-Location "$PSScriptRoot\backend"
python -m uvicorn main:app --host 127.0.0.1 --port 5000
