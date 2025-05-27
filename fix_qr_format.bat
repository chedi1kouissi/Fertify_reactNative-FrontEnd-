@echo off
echo ======================================================
echo        FIXING EXPO QR CODE FORMAT FOR IOS
echo ======================================================

echo Step 1: Stopping all node processes...
taskkill /F /IM node.exe 2>nul
echo Done!

echo Step 2: Completely cleaning cache and temporary files...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q "%TEMP%\metro-cache" 2>nul
rmdir /s /q "%APPDATA%\Expo\metro-cache" 2>nul
rmdir /s /q ".expo" 2>nul
echo Done!

echo Step 3: Temporarily removing expo-dev-client...
ren node_modules\expo-dev-client node_modules\expo-dev-client.bak 2>nul
echo Done!

echo Step 4: Setting environment variables...
set EXPO_DEV_CLIENT=false
set EXPO_NO_DEV_CLIENT=true
echo Done!

echo Step 5: Starting Expo with clean configuration...
call npx expo start --tunnel --clear
echo Done!

echo ======================================================
echo TROUBLESHOOTING TIPS:
echo 1. Make sure your iPhone has Expo Go installed
echo 2. Scan the QR code with your iPhone camera app
echo 3. If still not working, try manually entering the exp:// URL
echo ======================================================

pause
