@echo off
setlocal enabledelayedexpansion

:: =============================================================================
:: Docker ^& Docker Compose Installation Script (Windows CMD)
:: Requirements: Windows 10/11, winget (optional fallback to manual install)
:: =============================================================================

echo ============================================================
echo   Docker ^& Docker Compose Installation Script (Windows)
echo ============================================================
echo.

:: -----------------------------------------------------------------------------
:: 1. Detect Windows version
:: -----------------------------------------------------------------------------
echo [INFO]  Detecting Windows version...
for /f "tokens=*" %%V in ('ver') do set WIN_VER=%%V
echo [INFO]  OS version string : %WIN_VER%

for /f "skip=1 tokens=*" %%C in ('wmic os get Caption 2^>nul') do (
  if not "%%C"=="" (
    set WIN_CAPTION=%%C
    goto :got_caption
  )
)
:got_caption
echo [INFO]  OS caption        : %WIN_CAPTION%
echo.

:: -----------------------------------------------------------------------------
:: 2. Detect CPU architecture
:: -----------------------------------------------------------------------------
echo [INFO]  Detecting CPU architecture...
echo [INFO]  PROCESSOR_ARCHITECTURE = %PROCESSOR_ARCHITECTURE%

if /i "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
  echo [OK]    Architecture AMD64 ^(64-bit x86^) is supported.
  goto :arch_ok
)

if /i "%PROCESSOR_ARCHITECTURE%"=="ARM64" (
  echo [OK]    Architecture ARM64 is supported.
  goto :arch_ok
)

if /i "%PROCESSOR_ARCHITECTURE%"=="x86" (
  :: On 64-bit Windows running a 32-bit shell, PROCESSOR_ARCHITEW6432 holds the real arch
  if defined PROCESSOR_ARCHITEW6432 (
    if /i "%PROCESSOR_ARCHITEW6432%"=="AMD64" (
      echo [OK]    Architecture AMD64 ^(64-bit x86, detected via WOW64^) is supported.
      goto :arch_ok
    )
    if /i "%PROCESSOR_ARCHITEW6432%"=="ARM64" (
      echo [OK]    Architecture ARM64 ^(detected via WOW64^) is supported.
      goto :arch_ok
    )
  )
  echo [ERROR] 32-bit x86 is not supported by Docker Desktop.
  echo         Please use a 64-bit version of Windows.
  goto :end_fail
)

echo [ERROR] Unsupported or unrecognised architecture: %PROCESSOR_ARCHITECTURE%
echo         Docker Desktop requires AMD64 or ARM64.
goto :end_fail

:arch_ok
echo.

:: -----------------------------------------------------------------------------
:: 3. Check if Docker is already installed
:: -----------------------------------------------------------------------------
echo [INFO]  Checking if Docker is already installed...
docker --version >nul 2>&1
if %errorlevel%==0 (
  for /f "tokens=*" %%D in ('docker --version') do set DOCKER_VER=%%D
  echo [OK]    Docker is already installed: !DOCKER_VER!
  set DOCKER_ALREADY_INSTALLED=1
  goto :check_compose
)

echo [INFO]  Docker is not installed. Proceeding with installation...
set DOCKER_ALREADY_INSTALLED=0

:: -----------------------------------------------------------------------------
:: 4. Install Docker Desktop via winget
:: -----------------------------------------------------------------------------
echo [INFO]  Checking for winget...
where winget >nul 2>&1
if %errorlevel% neq 0 (
  echo [WARN]  winget is not available on this system.
  echo.
  echo         Please download and install Docker Desktop manually from:
  echo         https://www.docker.com/products/docker-desktop/
  echo.
  echo         After installation, re-run this script to verify the setup.
  goto :end_fail
)

echo [OK]    winget found. Installing Docker Desktop...
echo.
winget install -e --id Docker.DockerDesktop --accept-package-agreements --accept-source-agreements
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Docker Desktop installation via winget failed.
  echo         You can install it manually from:
  echo         https://www.docker.com/products/docker-desktop/
  goto :end_fail
)

echo.
echo [OK]    Docker Desktop installation completed via winget.
echo [WARN]  Docker Desktop may require a system restart to finish setup.
echo         Please restart your computer and then re-run this script to verify.
echo.

:: Refresh PATH so docker might be found without a full restart
set PATH=%PATH%;%ProgramFiles%\Docker\Docker\resources\bin

:: Try to verify immediately; if it fails, remind the user to restart
docker --version >nul 2>&1
if %errorlevel% neq 0 (
  echo [INFO]  Docker command is not yet available in this terminal session.
  echo         This is normal immediately after installation.
  echo         Please restart your terminal or computer and run this script again.
  goto :end_restart
)

for /f "tokens=*" %%D in ('docker --version') do set DOCKER_VER=%%D
echo [OK]    Docker is now installed: !DOCKER_VER!

:: -----------------------------------------------------------------------------
:: 5. Verify Docker Compose
:: -----------------------------------------------------------------------------
:check_compose
echo.
echo [INFO]  Verifying Docker Compose...
docker compose version >nul 2>&1
if %errorlevel%==0 (
  for /f "tokens=*" %%C in ('docker compose version') do set COMPOSE_VER=%%C
  echo [OK]    Docker Compose is available: !COMPOSE_VER!
  goto :end_success
)

echo [WARN]  Docker Compose is not responding.
echo         Docker Compose is bundled with Docker Desktop.
echo         Please ensure Docker Desktop is running, then try again.
echo         If the issue persists, open Docker Desktop ^> Settings ^> Reset to factory defaults.
goto :end_fail

:: -----------------------------------------------------------------------------
:: 6. Success
:: -----------------------------------------------------------------------------
:end_success
echo.
echo ============================================================
echo   All checks passed! Docker and Docker Compose are ready.
if "%DOCKER_ALREADY_INSTALLED%"=="0" (
  echo   Docker Desktop was just installed.
  echo   Please restart your terminal or computer to ensure all
  echo   environment variables and services are fully loaded.
)
echo ============================================================
echo.
endlocal
exit /b 0

:end_restart
echo ============================================================
echo   Installation complete — restart required.
echo   Please restart your computer, then run this script again
echo   to verify that Docker and Docker Compose are working.
echo ============================================================
echo.
endlocal
exit /b 0

:end_fail
echo.
echo ============================================================
echo   Installation could not be completed automatically.
echo   Please follow the manual steps described above.
echo ============================================================
echo.
endlocal
exit /b 1
