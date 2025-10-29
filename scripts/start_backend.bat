@echo off
echo ================================================
echo  SNPQIM Backend API - Iniciando...
echo ================================================
echo.

cd /d "%~dp0\.."

REM Verifica se Conda esta disponivel
conda --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERRO: Conda nao encontrado!
    echo.
    echo Execute primeiro: scripts\setup_env.bat
    echo.
    pause
    exit /b 1
)

REM Verifica se ambiente snpqim existe
conda env list | findstr "snpqim" >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERRO: Ambiente 'snpqim' nao encontrado!
    echo.
    echo Execute primeiro: scripts\setup_env.bat
    echo.
    pause
    exit /b 1
)

echo Ativando ambiente Conda 'snpqim'...
call conda activate snpqim

echo.
echo Iniciando API em http://localhost:8000
echo Documentacao em http://localhost:8000/docs
echo.
echo Pressione CTRL+C para parar
echo ================================================
echo.

python src\backend\main.py

pause
