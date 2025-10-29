@echo off
echo ================================================
echo  SNPQIM - Configuracao de Ambiente (Conda)
echo ================================================
echo.

cd /d "%~dp0\.."

echo Verificando Conda...
conda --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Conda nao encontrado!
    echo.
    echo Instale Anaconda ou Miniconda de:
    echo   https://www.anaconda.com/download
    echo.
    pause
    exit /b 1
)

conda --version

echo.
echo Verificando ambiente 'snpqim'...
conda env list | findstr "snpqim" >nul 2>&1
if errorlevel 1 (
    echo Criando ambiente Conda 'snpqim' com Python 3.11...
    conda create -n snpqim python=3.11 -y
) else (
    echo Ambiente 'snpqim' ja existe.
)

echo.
echo Ativando ambiente snpqim...
call conda activate snpqim

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
echo      conda activate snpqim
echo.
echo Ambiente: snpqim (Python 3.11)
echo.
pause
