@echo off
echo ========================================================
echo   FINBOT AI — DIGITAL FINANCIAL LITERACY CHATBOT
echo   Powered by IBM Watsonx.ai Granite Models
echo ========================================================
echo.

echo Starting FinBot AI Server on http://localhost:5000 ...
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 5000
pause
