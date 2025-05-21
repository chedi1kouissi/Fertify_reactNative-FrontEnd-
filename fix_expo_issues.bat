@echo off
echo ======================================================
echo        Fixing Expo Native Module List Issue
echo ======================================================

echo Step 1: Clearing node_modules...
rmdir /s /q node_modules
echo Done!

echo Step 2: Reinstalling dependencies...
call npm install
echo Done!

echo Step 3: Clearing Expo cache...
call npx expo-cli cache --clear
echo Done!

echo Step 4: Starting Expo with clean cache...
call npx expo start --clear
echo Done!

echo All steps completed. If you still have issues, try:
echo 1. Using app.config.js instead of app.json
echo 2. Ensuring Expo CLI is up to date (npm install -g expo-cli)
echo 3. Checking package.json for dependency conflicts

pause 