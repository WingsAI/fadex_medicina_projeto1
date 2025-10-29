@echo off
echo ================================================
echo  SNPQIM - Iniciando Sistema Completo
echo ================================================
echo.
echo Este script abrira 2 janelas:
echo  1. Backend API (porta 8000)
echo  2. WebApp (porta 3000)
echo.
echo Aguarde alguns segundos para tudo iniciar...
echo ================================================
echo.

cd /d "%~dp0"

:: Inicia backend em nova janela
start "SNPQIM Backend API" cmd /k start_backend.bat

:: Aguarda 3 segundos
timeout /t 3 /nobreak >nul

:: Inicia webapp em nova janela
start "SNPQIM WebApp" cmd /k start_webapp.bat

echo.
echo ================================================
echo  Sistema iniciado!
echo ================================================
echo.
echo  Backend API: http://localhost:8000
echo  WebApp:      http://localhost:3000
echo.
echo Aguarde alguns segundos para o webapp compilar...
echo Depois acesse: http://localhost:3000
echo ================================================
echo.

pause
