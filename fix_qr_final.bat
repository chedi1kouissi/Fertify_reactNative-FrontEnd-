@echo off
echo ======================================================
echo        FINAL QR CODE FIX FOR EXPO GO
echo ======================================================

echo Step 1: Stopping all node processes...
taskkill /F /IM node.exe 2>nul
echo Done!

echo Step 2: Uninstalling expo-dev-client package...
call npm uninstall expo-dev-client
echo Done!

echo Step 3: Clearing all caches thoroughly...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q "%TEMP%\metro-cache" 2>nul
rmdir /s /q "%APPDATA%\Expo\metro-cache" 2>nul
rmdir /s /q ".expo" 2>nul
echo Done!

echo Step 4: Starting Expo with tunnel...
call npx expo start --tunnel
echo Done!

echo ======================================================
echo After testing, you can reinstall the dev client with:
echo npm install expo-dev-client
echo ======================================================

pause
