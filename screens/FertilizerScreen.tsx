import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  Subheading,
  Paragraph, 
  TextInput, 
  HelperText, 
  Menu, 
  Divider, 
  Text, 
  Surface,
  Caption,
  useTheme,
  IconButton
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Api from '../services/api';

const FertilizerScreen = ({ navigation }) => {
  const theme = useTheme();
  
  // Form state
  const [ph, setPh] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [moisture, setMoisture] = useState('');
  
  // Dropdown menus
  const [soilType, setSoilType] = useState('');
  const [cropType, setCropType] = useState('');
  const [soilMenuVisible, setSoilMenuVisible] = useState(false);
  const [cropMenuVisible, setCropMenuVisible] = useState(false);
  
  // API state
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  // Soil and crop type options
  const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Silt'];
  const cropTypes = ['Rice', 'Wheat', 'Corn', 'Cotton'];

  // Form validation
  const validateNumber = (value) => {
    return value.trim() !== '' && !isNaN(Number(value));
  };

  const isFormValid = () => {
    return validateNumber(ph) && 
           validateNumber(nitrogen) && 
           validateNumber(phosphorus) && 
           validateNumber(potassium) && 
           validateNumber(temperature) && 
           validateNumber(humidity) && 
           validateNumber(moisture) && 
           soilType !== '' && 
           cropType !== '';
  };

  // Handle form submission
  const getRecommendation = async () => {
    if (!isFormValid()) {
      setError('Please fill all fields with valid values');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const requestData = {
        pH: parseFloat(ph),
        Nitrogen: parseFloat(nitrogen),
        Phosphorus: parseFloat(phosphorus),
        Potassium: parseFloat(potassium),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        moisture: parseFloat(moisture),
        territory_type: soilType,  // Note: Match the field name with what the server expects
        crop_type: cropType        // Note: Match the field name with what the server expects
      };
      
      console.log('Sending fertilizer request:', requestData);
      
      // Use the API service for prediction
      const result = await Api.predictFertilizer(requestData);
      
      if (result && result.fertilizer) {
      setRecommendation(result);
        // Optionally navigate to details screen
        // navigation.navigate('Details', { type: 'fertilizer', data: result });
      } else {
        setError('Received invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Error getting fertilizer recommendation:', error);
      
      // Check if it's a network error
      if (error.message && error.message.includes('Network Error')) {
        setError('Cannot connect to fertilizer service. Please check your network connection and ensure the server is running.');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.status} - ${error.response.data.error || 'Unknown error'}`);
      } else {
      setError('Failed to get recommendation. Please try again.');
      }
      
      // Show more detailed error for debugging
      if (__DEV__) {
        Alert.alert(
          'API Error',
          `Failed to connect to API server: ${error.message}\n\nCheck your network connection and server status.\n\nURL: ${Api.getFertilizerUrl()}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setPh('');
    setNitrogen('');
    setPhosphorus('');
    setPotassium('');
    setTemperature('');
    setHumidity('');
    setMoisture('');
    setSoilType('');
    setCropType('');
    setRecommendation(null);
    setError('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.headerSurface}>
          <MaterialCommunityIcons name="leaf" size={30} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerText}>Soil Analysis & Fertilizer Recommendation</Text>
        </Surface>
        
        {/* Loading Spinner Overlay */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Analyzing soil parameters...</Text>
          </View>
        )}
        
        <Card style={styles.card} elevation={2}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Soil Parameters</Subheading>
            <Caption style={styles.caption}>Enter your soil test results and environmental conditions</Caption>
            <Divider style={styles.divider} />
            
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <TextInput
                  label="pH"
                  value={ph}
                  onChangeText={setPh}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={ph !== '' && !validateNumber(ph)}
                  left={<TextInput.Icon name="water" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={ph !== '' && !validateNumber(ph)}>
                  pH must be a number
                </HelperText>
              </View>
              
              <View style={styles.inputColumn}>
                <TextInput
                  label="Temperature"
                  value={temperature}
                  onChangeText={setTemperature}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={temperature !== '' && !validateNumber(temperature)}
                  left={<TextInput.Icon name="thermometer" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={temperature !== '' && !validateNumber(temperature)}>
                  Temperature must be a number
                </HelperText>
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <TextInput
                  label="Humidity (%)"
                  value={humidity}
                  onChangeText={setHumidity}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={humidity !== '' && !validateNumber(humidity)}
                  left={<TextInput.Icon name="water-percent" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={humidity !== '' && !validateNumber(humidity)}>
                  Humidity must be a number
                </HelperText>
              </View>
              
              <View style={styles.inputColumn}>
                <TextInput
                  label="Moisture (%)"
                  value={moisture}
                  onChangeText={setMoisture}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={moisture !== '' && !validateNumber(moisture)}
                  left={<TextInput.Icon name="water-outline" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={moisture !== '' && !validateNumber(moisture)}>
                  Moisture must be a number
                </HelperText>
              </View>
            </View>
            
            <Subheading style={styles.sectionTitle}>Nutrient Levels</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <TextInput
                  label="Nitrogen (N)"
                  value={nitrogen}
                  onChangeText={setNitrogen}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={nitrogen !== '' && !validateNumber(nitrogen)}
                  left={<TextInput.Icon name="alpha-n-circle" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={nitrogen !== '' && !validateNumber(nitrogen)}>
                  Nitrogen must be a number
                </HelperText>
              </View>
              
              <View style={styles.inputColumn}>
                <TextInput
                  label="Phosphorus (P)"
                  value={phosphorus}
                  onChangeText={setPhosphorus}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={phosphorus !== '' && !validateNumber(phosphorus)}
                  left={<TextInput.Icon name="alpha-p-circle" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={phosphorus !== '' && !validateNumber(phosphorus)}>
                  Phosphorus must be a number
                </HelperText>
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <TextInput
                  label="Potassium (K)"
                  value={potassium}
                  onChangeText={setPotassium}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={potassium !== '' && !validateNumber(potassium)}
                  left={<TextInput.Icon name="alpha-k-circle" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={potassium !== '' && !validateNumber(potassium)}>
                  Potassium must be a number
                </HelperText>
              </View>
            </View>
            
            <Subheading style={styles.sectionTitle}>Soil & Crop Types</Subheading>
            <Divider style={styles.divider} />
            
            {/* Soil Type Dropdown */}
            <View style={styles.menuContainer}>
              <Menu
                visible={soilMenuVisible}
                onDismiss={() => setSoilMenuVisible(false)}
                anchor={
                  <Button 
                    mode="outlined" 
                    onPress={() => setSoilMenuVisible(true)}
                    style={styles.dropdown}
                    icon="soil"
                    contentStyle={styles.dropdownContent}
                    labelStyle={styles.dropdownLabel}
                    color={theme.colors.primary}
                  >
                    {soilType || "Select Soil Type"}
                  </Button>
                }
              >
                {soilTypes.map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setSoilType(type);
                      setSoilMenuVisible(false);
                    }}
                    title={type}
                  />
                ))}
              </Menu>
            </View>
            
            {/* Crop Type Dropdown */}
            <View style={styles.menuContainer}>
              <Menu
                visible={cropMenuVisible}
                onDismiss={() => setCropMenuVisible(false)}
                anchor={
                  <Button 
                    mode="outlined" 
                    onPress={() => setCropMenuVisible(true)}
                    style={styles.dropdown}
                    icon="seed"
                    contentStyle={styles.dropdownContent}
                    labelStyle={styles.dropdownLabel}
                    color={theme.colors.primary}
                  >
                    {cropType || "Select Crop Type"}
                  </Button>
                }
              >
                {cropTypes.map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setCropType(type);
                      setCropMenuVisible(false);
                    }}
                    title={type}
                  />
                ))}
              </Menu>
            </View>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={getRecommendation}
                loading={loading}
                disabled={loading || !isFormValid()}
                style={styles.submitButton}
                icon="leaf"
                labelStyle={styles.submitButtonText}
              >
                Get Recommendation
              </Button>
              
              <Button 
                mode="text" 
                onPress={resetForm}
                style={styles.resetButton}
                icon="refresh"
                color={theme.colors.text}
              >
                Reset Form
              </Button>
            </View>
          </Card.Content>
        </Card>
        
        {/* Recommendation Results */}
        {recommendation && (
          <Card style={[styles.card, styles.resultCard]} elevation={3}>
            <Card.Content>
              <View style={styles.resultHeader}>
                <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
                <Title style={styles.resultTitle}>Fertilizer Recommendation</Title>
              </View>
              <Divider style={styles.divider} />
              
              {/* Display the recommendation data here */}
              <Surface style={styles.resultContent}>
                {Object.entries(recommendation).map(([key, value]) => (
                  <View key={key} style={styles.resultItem}>
                    <Text style={styles.resultKey}>{key.replace(/_/g, ' ')}:</Text>
                    <Text style={styles.resultValue}>{value}</Text>
                  </View>
                ))}
              </Surface>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
    marginLeft: 10,
  },
  headerIcon: {
    marginRight: 5,
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
    marginTop: 16,
    marginBottom: 5,
  },
  caption: {
    marginBottom: 10,
    color: '#689F38',
  },
  divider: {
    backgroundColor: '#DCEDC8',
    height: 1.5,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  menuContainer: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  dropdown: {
    borderColor: '#AED581',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  dropdownContent: {
    height: 48,
  },
  dropdownLabel: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  submitButton: {
    paddingVertical: 6,
    borderRadius: 24,
    width: '100%',
    marginBottom: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    borderRadius: 24,
  },
  errorText: {
    color: '#D32F2F',
    marginVertical: 8,
    textAlign: 'center',
  },
  resultCard: {
    marginTop: 20,
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
    flexDirection: 'row',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DCEDC8',
    paddingBottom: 8,
  },
  resultKey: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#33691E',
    textTransform: 'capitalize',
  },
  resultValue: {
    flex: 2,
    fontSize: 14,
    color: '#424242',
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

export default FertilizerScreen; 