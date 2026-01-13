@echo off
REM Windows pre-commit wrapper — invoke Node-based precommit runner
pushd "%~dp0\.."
node "%~dp0..\scripts\copilot-precommit-runner.js" --interactive %*
set RC=%ERRORLEVEL%
popd
exit /b %RC%
