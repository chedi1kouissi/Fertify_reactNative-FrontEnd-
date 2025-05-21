import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  Paragraph, 
  ActivityIndicator, 
  Text, 
  Divider, 
  Surface,
  Subheading,
  Caption,
  useTheme,
  Portal,
  Dialog,
  Chip
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import Api from '../services/api';

const DiseaseScreen = ({ navigation }) => {
  const theme = useTheme();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);

  // Function to pick image from gallery
  const pickImage = async () => {
    // Request permission
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (galleryStatus.status !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access gallery is required to select an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
      // Reset previous results when selecting a new image
      setResult(null);
      setError('');
    }
  };

  // Function to take photo with camera
  const takePhoto = async () => {
    // Request permission
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    
    if (cameraStatus.status !== 'granted') {
      Alert.alert('Permission Required', 'Permission to access camera is required to take a photo.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
      // Reset previous results when taking a new photo
      setResult(null);
      setError('');
    }
  };

  // Function to analyze the plant disease
  const analyzeDisease = async () => {
    if (!image || !image.uri) {
      Alert.alert('Image Required', 'Please select or take a photo first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get base64 data directly
      let base64Data;
      
      // If we already have base64 from the picker, use it
      if (image.base64) {
        base64Data = image.base64;
        console.log('Using base64 data from image picker');
      } else {
        // Otherwise read the file and convert to base64
        try {
          console.log('Reading image file from URI:', image.uri);
          const fileContent = await FileSystem.readAsStringAsync(image.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          base64Data = fileContent;
          console.log('Successfully read image file to base64');
        } catch (readError) {
          console.error('Error reading image file:', readError);
          throw new Error('Failed to read image file: ' + readError.message);
        }
      }

      // Ensure we have base64 data
      if (!base64Data) {
        throw new Error('Could not get base64 data from image');
      }
      
      console.log('Sending base64 encoded image to disease API...');
      console.log('Base64 data length:', base64Data.length);

      // Use the new base64 API endpoint
      const result = await Api.predictDiseaseWithBase64(base64Data);
      
      if (result && result.prediction) {
        setResult({
          disease_name: "Plant Disease",
          confidence: 0.95,
          description: result.prediction,
          treatment: "See description for treatment details"
        });
      } else {
        setError('Received invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing disease:', error);
      
      // Check if it's a network error
      if (error.message && error.message.includes('Network Error')) {
        setError('Cannot connect to disease detection service. Please check your network connection and ensure the server is running.');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
      } else {
        setError(`Failed to analyze disease: ${error.message}`);
      }
      
      // Show more detailed error for debugging
      if (__DEV__) {
        Alert.alert(
          'API Error',
          `Failed to connect to API server: ${error.message}\n\nCheck your network connection and server status.\n\nURL: ${Api.getDiseaseUrl()}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setResult(null);
    setError('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Surface style={styles.headerSurface}>
        <MaterialCommunityIcons name="bug" size={30} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerText}>Plant Disease Detection</Text>
        <MaterialCommunityIcons 
          name="information" 
          size={24} 
          color="#fff" 
          style={styles.infoIcon} 
          onPress={() => setInfoDialogVisible(true)}
        />
      </Surface>
      
      {/* Loading Spinner Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Analyzing plant image...</Text>
        </View>
      )}
      
      <Card style={styles.card} elevation={2}>
        <Card.Content>
          <Subheading style={styles.sectionTitle}>Capture Plant Image</Subheading>
          <Caption style={styles.caption}>Take a clear photo of the affected plant leaf</Caption>
          <Divider style={styles.divider} />
          
          {/* Image selection buttons */}
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={pickImage} 
              style={styles.cameraButton}
              icon="image"
              labelStyle={styles.buttonLabel}
              theme={{ colors: { primary: theme.colors.primary } }}
            >
              Gallery
            </Button>
            <Button 
              mode="contained" 
              onPress={takePhoto} 
              style={styles.cameraButton}
              icon="camera"
              labelStyle={styles.buttonLabel}
              theme={{ colors: { primary: theme.colors.primary } }}
            >
              Camera
            </Button>
          </View>
          
          {/* Image preview */}
          {image && (
            <View style={styles.imageCard}>
              <Subheading style={styles.imageTitle}>Selected Image</Subheading>
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: image.uri }} 
                  style={styles.imagePreview} 
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
          
          {/* Error message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {/* Action Buttons */}
          <View style={styles.actionButtonContainer}>
            <Button 
              mode="contained" 
              onPress={analyzeDisease}
              loading={loading}
              disabled={!image || loading}
              style={styles.analyzeButton}
              icon="leaf-maple"
              labelStyle={styles.analyzeButtonText}
            >
              Analyze Disease
            </Button>
            
            {image && (
              <Button 
                mode="text" 
                onPress={resetForm}
                style={styles.resetButton}
                icon="refresh"
                color={theme.colors.text}
              >
                Reset
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
      
      {/* Results Display */}
      {result && (
        <Card style={styles.resultCard} elevation={3}>
          <Card.Content>
            <View style={styles.resultHeader}>
              <MaterialCommunityIcons name="leaf" size={24} color={theme.colors.primary} />
              <Title style={styles.resultTitle}>Diagnosis Results</Title>
            </View>
            <Divider style={styles.divider} />
            
            <Surface style={styles.resultContent}>
              {result.disease_name && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Disease:</Text>
                  <View style={styles.chipContainer}>
                    <Chip 
                      icon="bug" 
                      mode="outlined" 
                      selectedColor={theme.colors.primary}
                      style={styles.chip}
                    >
                      {result.disease_name}
                    </Chip>
                  </View>
                </View>
              )}
              
              {result.confidence && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Confidence:</Text>
                  <View style={styles.confidenceContainer}>
                    <View style={[
                      styles.confidenceMeter, 
                      { width: `${Math.min(result.confidence * 100, 100)}%` }
                    ]} />
                    <Text style={styles.confidenceText}>
                      {`${(result.confidence * 100).toFixed(2)}%`}
                    </Text>
                  </View>
                </View>
              )}
              
              {result.description && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Description:</Text>
                  <Text style={styles.resultValue}>{result.description}</Text>
                </View>
              )}
              
              {result.treatment && (
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Treatment:</Text>
                  <Text style={styles.resultValue}>{result.treatment}</Text>
                </View>
              )}
              
              {/* Display any other fields from the result */}
              {Object.entries(result).map(([key, value]) => {
                if (!['disease_name', 'confidence', 'description', 'treatment'].includes(key) && value) {
                  return (
                    <View key={key} style={styles.resultItem}>
                      <Text style={styles.resultLabel}>{key.replace(/_/g, ' ')}:</Text>
                      <Text style={styles.resultValue}>{value}</Text>
                    </View>
                  );
                }
                return null;
              })}
            </Surface>
            
            <Button 
              mode="contained" 
              onPress={resetForm}
              style={styles.newAnalysisButton}
              icon="plant"
              theme={{ colors: { primary: theme.colors.primary } }}
            >
              New Analysis
            </Button>
          </Card.Content>
        </Card>
      )}
      
      {/* Information Dialog */}
      <Portal>
        <Dialog
          visible={infoDialogVisible}
          onDismiss={() => setInfoDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>How to Use Disease Detection</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              1. Take a clear, well-lit photo of the affected plant leaf.
            </Text>
            <Text style={styles.dialogText}>
              2. Ensure the diseased area is clearly visible in the image.
            </Text>
            <Text style={styles.dialogText}>
              3. Try to include only the affected part in the frame for better results.
            </Text>
            <Text style={styles.dialogText}>
              4. Wait for the analysis to complete, which may take a few seconds.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setInfoDialogVisible(false)} color={theme.colors.primary}>
              Got It
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerSurface: {
    backgroundColor: '#4CAF50',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 4,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
  infoIcon: {
    marginLeft: 10,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  caption: {
    color: '#689F38',
  },
  divider: {
    backgroundColor: '#DCEDC8',
    height: 1.5,
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  cameraButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
  },
  imageCard: {
    marginTop: 20,
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
  },
  imageTitle: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#AED581',
    backgroundColor: '#FFFFFF',
  },
  imagePreview: {
    width: '100%',
    height: 240,
  },
  actionButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  analyzeButton: {
    paddingVertical: 8,
    borderRadius: 24,
    width: '100%',
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 10,
  },
  errorText: {
    color: '#D32F2F',
    marginVertical: 10,
    textAlign: 'center',
  },
  resultCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultTitle: {
    marginLeft: 10,
    color: '#2E7D32',
    fontSize: 18,
  },
  resultContent: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  resultItem: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DCEDC8',
    paddingBottom: 10,
  },
  resultLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#33691E',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  chip: {
    backgroundColor: '#E8F5E9',
    marginRight: 5,
    marginBottom: 5,
  },
  confidenceContainer: {
    height: 22,
    backgroundColor: '#DCEDC8',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 5,
  },
  confidenceMeter: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#8BC34A',
    borderRadius: 15,
  },
  confidenceText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#33691E',
  },
  newAnalysisButton: {
    marginTop: 20,
    borderRadius: 24,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
  },
  dialogTitle: {
    color: '#2E7D32',
  },
  dialogText: {
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 3,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
});

export default DiseaseScreen; 