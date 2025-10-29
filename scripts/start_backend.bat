@echo off
echo ================================================
echo  SNPQIM Backend API - Iniciando...
echo ================================================
echo.

cd /d "%~dp0\.."

REM Verifica se ambiente virtual existe
if not exist "venv\Scripts\activate.bat" (
    echo.
    echo ERRO: Ambiente virtual nao encontrado!
    echo.
    echo Execute primeiro: scripts\setup_env.bat
    echo.
    pause
    exit /b 1
)

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Iniciando API em http://localhost:8000
echo Documentacao em http://localhost:8000/docs
echo.
echo Pressione CTRL+C para parar
echo ================================================
echo.

python src\backend\main.py

pause
