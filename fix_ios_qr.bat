@echo off
echo ======================================================
echo        Fixing Expo QR Code Issue for iOS
echo ======================================================

echo Step 1: Clearing Expo cache...
call npx expo-cli cache --clear
echo Done!

echo Step 2: Starting Expo with tunnel option (better for external devices)...
call npx expo start --tunnel --clear
echo Done!

echo ======================================================
echo Instructions:
echo 1. Make sure your iPhone and computer are on the same Wi-Fi network
echo 2. Wait for the QR code to appear with the tunnel URL
echo 3. Scan the QR code with your iPhone camera
echo 4. Open the link in Expo Go
echo ======================================================

pause 