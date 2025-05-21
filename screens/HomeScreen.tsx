import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Card, Title, Paragraph } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const takePicture = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeSoil = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    
    // Example API call using axios
    try {
      // This is a placeholder URL - replace with your actual API endpoint
      const response = await axios.post('https://api.example.com/analyze-soil', {
        image: image
      });
      
      // Navigate to details screen with the results
      navigation.navigate('Details', { results: response.data });
    } catch (error) {
      console.error('Error analyzing soil:', error);
      alert('Failed to analyze soil. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Fertify Soil Analysis</Title>
          <Paragraph>Take or select a picture of your soil for analysis</Paragraph>
        </Card.Content>
        
        <View style={styles.imageContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
        
        <Card.Actions style={styles.actions}>
          <Button mode="contained" onPress={pickImage} style={styles.button}>
            Pick Image
          </Button>
          <Button mode="contained" onPress={takePicture} style={styles.button}>
            Take Picture
          </Button>
        </Card.Actions>
        
        <Card.Actions style={styles.actions}>
          <Button 
            mode="contained" 
            onPress={analyzeSoil}
            loading={loading}
            disabled={!image || loading}
            style={[styles.button, styles.analyzeButton]}
          >
            Analyze Soil
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginVertical: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 250,
    height: 200,
    borderRadius: 8,
  },
  actions: {
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  button: {
    margin: 8,
  },
  analyzeButton: {
    width: '80%',
  },
});

export default HomeScreen; 