# Fertify App - Splash Screen and Loading Spinners

This document explains the recent additions to the Fertify app:

## 1. Splash Screen

A splash screen has been added to display the Fertify logo when the app is launched. The splash screen:

- Shows the Fertify logo centered on a white background
- Displays the app name "Fertify" and tagline "AI-Powered Agriculture"
- Automatically navigates to the main screen after 3 seconds

### Implementation Details:

- Created a new `SplashScreen.tsx` component
- Updated `App.tsx` to include the splash screen as the initial route
- Uses the existing `splash-icon.png` from the assets directory

### Required Assets:

For the splash screen to work correctly, you need to update/create the `splash-icon.png` file in the assets directory to match the Fertify logo concept.

## 2. Loading Spinners

Loading spinners have been added to both the Fertilizer and Disease screens to indicate when a request is being processed.

### Fertilizer Screen:

- Shows a loading overlay with the text "Analyzing soil parameters..."
- Appears when submitting soil data for fertilizer recommendations
- Covers the entire screen to prevent further interaction until processing is complete

### Disease Screen:

- Shows a loading overlay with the text "Analyzing plant image..."
- Appears when analyzing a plant image for disease detection
- Covers the entire screen to prevent further interaction until processing is complete

### Implementation Details:

- Added `loadingOverlay` and `loadingText` styles to both screens
- Implemented conditional rendering based on the `loading` state
- Used the built-in `ActivityIndicator` component from React Native Paper

## Testing

To test these new features:

1. **Splash Screen**: Run the app and observe the splash screen appearing for 3 seconds before navigating to the main screen
2. **Loading Spinners**:
   - On the Fertilizer screen: Fill out the form and submit to see the loading spinner
   - On the Disease screen: Select an image and tap "Analyze Disease" to see the loading spinner

## Design Consistency

All new elements follow the app's existing green color scheme and design language:

- The splash screen uses the main green color (#4CAF50) for the app name
- The loading spinners use the same green color for consistency
- The overlay backgrounds use a semi-transparent white (rgba(255, 255, 255, 0.8)) to maintain focus on the UI 