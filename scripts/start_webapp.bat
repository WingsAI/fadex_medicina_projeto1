@echo off
echo ================================================
echo  SNPQIM WebApp - Iniciando...
echo ================================================
echo.

cd /d "%~dp0\..\webapp"

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale Node.js 18+ e tente novamente.
    pause
    exit /b 1
)

echo.
echo Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando dependencias pela primeira vez...
    call npm install
)

echo.
echo Iniciando webapp em http://localhost:3000
echo.
echo Pressione CTRL+C para parar
echo ================================================
echo.

call npm run dev

pause
