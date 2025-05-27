@echo off
echo ======================================================
echo        Starting Expo Web Preview
echo ======================================================

echo Step 1: Stopping any running Expo processes...
taskkill /F /IM node.exe 2>nul
echo Done!

echo Step 2: Clearing Metro bundler cache...
rmdir /s /q "%TEMP%\metro-cache" 2>nul
rmdir /s /q "%APPDATA%\Expo\metro-cache" 2>nul
rmdir /s /q ".expo" 2>nul
echo Done!

echo Step 3: Starting Expo Web Preview...
call npx expo start --web --clear
echo Done!

echo ======================================================
echo Instructions:
echo 1. Web preview should automatically open in your browser
echo 2. If not, manually navigate to http://localhost:19006
echo ======================================================

pause
