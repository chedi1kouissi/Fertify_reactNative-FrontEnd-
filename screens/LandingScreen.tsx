import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      
      {/* Logo and Welcome Section */}
      <View style={styles.welcomeSection}>
        <Image
          source={require('../assets/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.welcomeText}>Welcome to your</Text>
        <Text style={styles.appTitle}>AI Agriculture Assistant</Text>
        <Text style={styles.subtitle}>
          Smart solutions for modern farming
        </Text>
      </View>

      {/* Services Section */}
      <Text style={styles.sectionTitle}>Choose a Service</Text>
      
      {/* Fertilizer Card */}
      <TouchableOpacity 
        style={styles.cardContainer}
        onPress={() => navigation.navigate('Main', { screen: 'Fertilizer' })}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#4CAF50', '#388E3C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIconContainer}>
              <MaterialCommunityIcons name="leaf" size={42} color="#FFFFFF" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Fertilizer Recommendation</Text>
              <Text style={styles.cardDescription}>
                Get AI-powered fertilizer recommendations based on soil nutrients
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Disease Card */}
      <TouchableOpacity 
        style={styles.cardContainer}
        onPress={() => navigation.navigate('Main', { screen: 'Disease' })}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#8BC34A', '#689F38']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIconContainer}>
              <MaterialCommunityIcons name="bug" size={42} color="#FFFFFF" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Disease Detection</Text>
              <Text style={styles.cardDescription}>
                Identify plant diseases with AI image recognition technology
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About Our App</Text>
        <Text style={styles.aboutText}>
          Our AI Agriculture Assistant helps farmers make data-driven decisions to increase crop yields and reduce disease. 
          Powered by advanced machine learning models.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    color: '#757575',
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#689F38',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  aboutSection: {
    marginTop: 20,
    backgroundColor: '#F1F8E9',
    padding: 20,
    borderRadius: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
});

export default LandingScreen; 