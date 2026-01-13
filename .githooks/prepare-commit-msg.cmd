@echo off
:: prepare-commit-msg hook for Windows Git
:: Run the copilot precommit runner in interactive mode before the commit editor opens.
setlocal
for /f "delims=" %%i in ('git rev-parse --show-toplevel 2^>nul') do set REPO_ROOT=%%i
if not defined REPO_ROOT set REPO_ROOT=.
cd /d "%REPO_ROOT%"

where node >nul 2>nul
if %errorlevel%==0 (
  node "%REPO_ROOT%\scripts\copilot-precommit-runner.js" --interactive
  if errorlevel 1 exit /b %errorlevel%
)

exit /b 0
