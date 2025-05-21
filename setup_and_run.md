# Fertify Project Setup and Running Guide

This guide explains how to fix common issues and run both the React Native frontend (Fertify_react) and Python Flask backend (greenAI).

## Fixing Common Expo Errors

### Fixing "Failed to parse manifest JSON" Error

If you encounter a "failed to parse manifest JSON" error when running the Expo React Native project, follow these steps:

1. Make sure `app.json` has proper fields:
   - Ensure all JSON is properly formatted with no trailing commas
   - Add the `extra.eas.projectId` field (replace with your actual project ID if available)

2. Clear Metro bundler cache:
   ```
   cd Fertify_react
   npx expo start --clear
   ```

3. If the error persists, try resetting the Expo cache:
   ```
   expo r -c
   ```

### Fixing "The bundled native module list from the Expo API is empty" Error

If you encounter this error, it's typically due to a compatibility issue with the Expo SDK version:

1. Remove the `sdkVersion` field from your app.json if it exists
   - Expo CLI now automatically detects the correct SDK version from your package.json

2. Clear node_modules and reinstall dependencies:
   ```
   cd Fertify_react
   rm -rf node_modules
   npm install
   ```

3. Clear the Expo cache and restart:
   ```
   npx expo start --clear
   ```

4. If the issue persists, try creating a new app.config.js file:
   ```javascript
   // app.config.js
   export default {
     name: "Fertify",
     slug: "Fertify_react",
     version: "1.0.0",
     orientation: "portrait",
     // other configuration from app.json...
   };
   ```

## Running the greenAI Backend

The backend consists of two Flask services: fertilizer recommendation and disease detection.

### Prerequisites
1. Install Python dependencies:
   ```
   cd greenAI
   pip install -r requirements.txt
   ```

2. Ensure all file paths in the Python scripts are correct for your system

### Starting the Backend Services

#### On Windows:
Simply run the provided batch script:
```
cd greenAI
start_services.bat
```

Or directly run the controller:
```
cd greenAI
python controller.py
```

#### On macOS/Linux:
Use the shell script:
```
cd greenAI
sh start_services.sh
```

Or directly run the controller:
```
cd greenAI
python controller.py
```

### What Happens When You Start the Backend

When you run the controller:
1. It checks and kills any processes already running on ports 5001 and 5002
2. Starts the Fertilizer Recommendation Service on port 5001
3. Starts the Disease Detection Service on port 5002
4. Displays the API endpoints for each service

The services will be available at:
- Fertilizer API: http://localhost:5001/predict_fertilizer/
- Disease Detection API: http://localhost:5002/predict_disease/

## Running the React Native Frontend

1. Make sure the backend services are running
2. Open a new terminal window

3. Navigate to the React Native project directory:
   ```
   cd Fertify_react
   ```

4. Install dependencies if not already done:
   ```
   npm install
   ```

5. Start the Expo development server:
   ```
   npx expo start
   ```

6. Choose how to run the app:
   - Press `a` to run on Android emulator
   - Press `i` to run on iOS simulator
   - Scan the QR code with the Expo Go app on your physical device

## Connecting Frontend and Backend

The React Native app is configured to connect to the Flask backend services. Make sure:

1. The backend services are running on ports 5001 and 5002
2. Your mobile device/emulator can access your computer's localhost
   - If using a physical device, you may need to update the API URLs in the React Native code to use your computer's IP address instead of localhost

## Troubleshooting

1. **Backend Connection Issues:**
   - Ensure the Flask servers are running
   - Check if the ports are accessible and not blocked by firewall
   - Verify the API endpoints in your React Native code match the Flask services

2. **Image Upload Issues:**
   - Ensure proper permissions for camera and storage access
   - Check that the FormData object is correctly formatted in the React Native code

3. **Backend Fails to Start:**
   - Check Python version (recommended: Python 3.8+)
   - Ensure all dependencies are installed
   - Look for error messages in the console output

4. **Expo/React Native Build Issues:**
   - Try using older Expo SDK version if you encounter compatibility issues
   - For Windows users, ensure you have the necessary build tools installed
   - Check that all native dependencies are properly linked 