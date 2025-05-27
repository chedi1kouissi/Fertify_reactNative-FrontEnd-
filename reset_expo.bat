@echo off
echo ======================================================
echo        COMPLETE EXPO RESET AND QR FIX
echo ======================================================

echo Step 1: Stopping all node processes...
taskkill /F /IM node.exe 2>nul
echo Done!

echo Step 2: Creating backup of app.json...
copy app.json app.json.bak
echo Done!

echo Step 3: Simplifying app.json configuration...
echo {> app.json
echo   "expo": {>> app.json
echo     "name": "Fertify",>> app.json
echo     "slug": "fertify",>> app.json
echo     "version": "1.0.0",>> app.json
echo     "orientation": "portrait",>> app.json
echo     "icon": "./assets/icon.png",>> app.json
echo     "splash": {>> app.json
echo       "image": "./assets/splash-icon.png",>> app.json
echo       "resizeMode": "contain",>> app.json
echo       "backgroundColor": "#ffffff">> app.json
echo     },>> app.json
echo     "assetBundlePatterns": ["**/*"],>> app.json
echo     "ios": {>> app.json
echo       "supportsTablet": true>> app.json
echo     },>> app.json
echo     "android": {>> app.json
echo       "adaptiveIcon": {>> app.json
echo         "foregroundImage": "./assets/adaptive-icon.png",>> app.json
echo         "backgroundColor": "#ffffff">> app.json
echo       }>> app.json
echo     }>> app.json
echo   }>> app.json
echo }>> app.json
echo Done!

echo Step 4: Clearing all caches...
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q "%TEMP%\metro-cache" 2>nul
rmdir /s /q "%APPDATA%\Expo\metro-cache" 2>nul
rmdir /s /q ".expo" 2>nul
echo Done!

echo Step 5: Disabling dev client...
set EXPO_DEV_CLIENT=false
echo Done!

echo Step 6: Starting Expo with tunnel...
call npx expo start --tunnel
echo Done!

echo ======================================================
echo If this doesn't work, try these additional steps:
echo 1. Run: npm uninstall expo-dev-client
echo 2. Run: npm install
echo 3. Run this script again
echo ======================================================

pause
