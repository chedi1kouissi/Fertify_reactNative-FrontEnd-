@echo off
echo ======================================================
echo        FIXING REACT VERSION MISMATCHES
echo ======================================================

echo Step 1: Stopping any running Expo processes...
taskkill /F /IM node.exe 2>nul
echo Done!

echo Step 2: Installing compatible React versions for Expo SDK 53...
call npm install react@19.0.0 react-dom@19.0.0 @types/react@~19.0.10
echo Done!

echo Step 3: Clearing Metro bundler cache...
rmdir /s /q .expo 2>nul
echo Done!

echo Step 4: Starting Expo with tunnel...
call npx expo start --tunnel
echo Done!

echo ======================================================
echo Your app should now work correctly without version errors!
echo ======================================================

pause
