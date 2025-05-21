import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const theme = useTheme();
  
  useEffect(() => {
    // Navigate to landing page after 3 seconds
    const timer = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        })
      );
    }, 3000);
    
    // Clean up timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);
  
  return (
    <LinearGradient
      colors={['#E8F5E9', '#BFDAC2', '#8BC34A']}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Logo Image with animation */}
      <Image
        source={require('../assets/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      {/* Tagline only */}
      <Text style={styles.tagline}>
        AI-Powered Agriculture Assistant
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65,
    marginBottom: 30,
  },
  tagline: {
    fontSize: 20,
    color: '#0A5C36',
    letterSpacing: 1,
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

export default SplashScreen; 