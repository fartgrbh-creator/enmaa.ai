@echo off
cls
echo.
echo   ╔══════════════════════════════════════╗
echo   ║      ✦ Enmaa.ai v2.0 ✦              ║
echo   ║  Multi-Model AI Platform             ║
echo   ║  Education ^& Research                ║
echo   ╚══════════════════════════════════════╝
echo.
echo   📦 25+ Free Open-Source AI Models
echo   ⚔️  Arena Mode  |  💬 Chat  |  🔍 Research
echo.
echo   ──────────────────────────────────────────
echo     [1]  Open Standalone Site (no backend)
echo     [2]  Start Server ^(requires Node.js^)
echo     [3]  Exit
echo   ──────────────────────────────────────────
echo.

:menu
set /p choice="  Choose (1-3): "
if "%choice%"=="1" start "" "public\index.html" & echo. & echo   ^> Site opened in your browser! & timeout /t 3 >nul & exit /b
if "%choice%"=="2" start http://localhost:3000 & node server.js & pause & exit /b
if "%choice%"=="3" exit /b
echo   Invalid choice. & goto menu
