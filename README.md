# Fertify - Agriculture Assistant App

A mobile application for fertilizer recommendation and plant disease detection powered by AI.

## Features

- **Fertilizer Recommendation**: Get personalized fertilizer recommendations based on soil parameters and crop type
- **Plant Disease Detection**: Identify plant diseases from leaf images and get treatment suggestions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Python 3.8+ (for backend services)
- Flask (`pip install flask flask-cors flask-session google-generativeai PyPDF2 pandas`)

## Getting Started

### 1. Start the Backend Services

First, start the Flask backend services that power the AI recommendations:

```bash
# Navigate to the greenAI directory
cd greenAI

# Windows
start_services.bat

# Unix/Linux/Mac
chmod +x start_services.sh
./start_services.sh
```

Verify the services are running by accessing:
- Fertilizer service: http://localhost:5001/health
- Disease detection service: http://localhost:5002/health

### 2. Start the React Native App

```bash
# Navigate to the Fertify_react directory
cd Fertify_react

# Install dependencies
npm install

# Start the Expo development server
npm start
```

This will open a development menu in your browser. You can run the app on:
- Android device/emulator: Press `a` in the terminal or click "Run on Android" in the browser
- iOS device/simulator: Press `i` in the terminal or click "Run on iOS simulator" (Mac only)
- Web browser: Press `w` in the terminal or click "Run in web browser"

### 3. Configure API Connection

When the app starts, use the API Config button in the top-right corner to set your computer's IP address. This is required so the mobile app can connect to the backend services.

1. Click the API Config button
2. Enter your computer's IP address (e.g., 172.20.10.4)
3. Press "Test Connection" to verify connectivity
4. If the connections succeed, press "Save"

## Troubleshooting

If you encounter any issues with the API connections:

1. Ensure both backend services are running (check the health endpoints mentioned above)
2. Verify you're using the correct IP address in the API Config screen
3. Make sure your mobile device and computer are on the same network
4. Check that no firewall is blocking the connections to ports 5001 and 5002
5. Try restarting the backend services using the start_services script

## License

This project is licensed under the MIT License - see the LICENSE file for details. 