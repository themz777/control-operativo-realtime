@echo off
REM Script de instalacion rapida para Windows (ejecutar como Administrador)
REM Control Operativo - Setup Automatico

echo ===================================================================
echo  CONTROL OPERATIVO - INSTALACION RAPIDA
echo ===================================================================
echo.

REM Verificar Node.js
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado.
    echo Descarga desde: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo OK - Node.js %NODE_VER% encontrado
)
echo.

REM Navegar a carpeta del proyecto
echo [2/5] Navegando a carpeta del proyecto...
cd /d "%~dp0"
echo OK - En: %cd%
echo.

REM Instalar dependencias
echo [3/5] Instalando dependencias (esto puede tardar ~30 seg)...
call npm install
if errorlevel 1 (
    echo ERROR en npm install
    pause
    exit /b 1
)
echo OK - Dependencias instaladas
echo.

REM Verificar setup
echo [4/5] Verificando setup...
node scripts/init.js
if errorlevel 1 (
    echo ERROR en verificacion
    pause
    exit /b 1
)
echo.

REM Mostrar instrucciones finales
echo [5/5] Listo!
echo.
echo ===================================================================
echo  PROXIMOS PASOS:
echo ===================================================================
echo.
echo Para iniciar el servidor, ejecuta:
echo   npm start
echo.
echo Luego abre en tu navegador:
echo   Admin:    http://localhost:3000/admin.html
echo   Pantalla: http://localhost:3000/display.html
echo.
echo ===================================================================
echo.
pause
