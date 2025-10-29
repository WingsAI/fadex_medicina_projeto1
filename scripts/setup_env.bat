@echo off
echo ================================================
echo  SNPQIM - Configuracao de Ambiente
echo ================================================
echo.

cd /d "%~dp0\.."

echo Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo.
    echo Instale Python 3.9+ de: https://www.python.org/downloads/
    echo.
    echo IMPORTANTE: Durante instalacao, marque:
    echo   [x] Add Python to PATH
    echo.
    pause
    exit /b 1
)

python --version

echo.
echo Criando ambiente virtual...
if exist "venv\" (
    echo Ambiente virtual ja existe. Removendo...
    rmdir /s /q venv
)

python -m venv venv

echo.
echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Atualizando pip...
python -m pip install --upgrade pip

echo.
echo Instalando dependencias do backend...
echo (Isso pode levar alguns minutos...)
pip install -r requirements-backend.txt

echo.
echo ================================================
echo  Configuracao concluida!
echo ================================================
echo.
echo Proximos passos:
echo   1. Use os scripts em scripts/ para iniciar
echo   2. Ou ative o ambiente manualmente:
echo      venv\Scripts\activate.bat
echo.
pause
