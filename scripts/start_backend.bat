@echo off
echo ================================================
echo  SNPQIM Backend API - Iniciando...
echo ================================================
echo.

cd /d "%~dp0\.."

echo Verificando dependencias...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Instale Python 3.9+ e tente novamente.
    pause
    exit /b 1
)

echo.
echo Iniciando API em http://localhost:8000
echo Documentacao em http://localhost:8000/docs
echo.
echo Pressione CTRL+C para parar
echo ================================================
echo.

python src\backend\main.py

pause
