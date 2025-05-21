import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

// Import screens
import FertilizerScreen from './screens/FertilizerScreen';
import DiseaseScreen from './screens/DiseaseScreen';
import DetailsScreen from './screens/DetailsScreen';
import SplashScreen from './screens/SplashScreen';
import LandingScreen from './screens/LandingScreen';
import ApiConfig from './components/ApiConfig';
import HeaderLogo from './components/HeaderLogo';

// Define the navigation stacks
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Define custom theme with agricultural green tones
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',          // Main green
    accent: '#8BC34A',           // Light green
    background: '#F1F8E9',       // Very light green background
    surface: '#FFFFFF',
    text: '#2E7D32',             // Dark green text
    placeholder: '#AED581',      // Light green placeholder
    backdrop: 'rgba(76, 175, 80, 0.2)',
    notification: '#FF9800',     // Orange for notifications
  },
  roundness: 12,                 // Increased roundness for modern look
  animation: {
    scale: 1.0,
  },
};

// Main tab navigator
function MainTabs() {
  return (
    <View style={{ flex: 1 }}>
      <ApiConfig />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Fertilizer') {
              iconName = focused ? 'leaf' : 'leaf-outline';
            } else if (route.name === 'Disease') {
              iconName = focused ? 'bug' : 'bug-outline';
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#AED581',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E8F5E9',
            elevation: 8,
            height: 60,
            paddingBottom: 8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: -5,
          },
          headerStyle: {
            backgroundColor: '#4CAF50',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTintColor: '#fff',
        })}
      >
        <Tab.Screen 
          name="Fertilizer" 
          component={FertilizerScreen} 
          options={{ 
            headerTitle: () => <HeaderLogo />,
            headerShown: true,
          }}
        />
        <Tab.Screen 
          name="Disease" 
          component={DiseaseScreen} 
          options={{ 
            headerTitle: () => <HeaderLogo />,
            headerShown: true,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4CAF50',
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            cardStyle: {
              backgroundColor: '#FFFFFF',
            }
          }}
        >
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Landing" 
            component={LandingScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Main" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen} 
            options={{ 
              headerTitle: () => <HeaderLogo />,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" backgroundColor="#4CAF50" />
    </PaperProvider>
  );
}
