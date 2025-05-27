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
// Removed DropDown import as we're using Menu instead
import Api from '../services/api';

// Define types for navigation prop
interface FertilizerScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const FertilizerScreen = ({ navigation }: FertilizerScreenProps) => {
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
  interface Recommendation {
    fertilizer: string;
    description?: string;
    [key: string]: any; // For any other properties
  }
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState('');

  // Soil and crop type options
  const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Silt'];
  const cropTypes = ['Rice', 'Wheat', 'Corn', 'Cotton'];

  // Form validation with realistic agricultural limits
  const validateNumber = (value: string): boolean => {
    return value.trim() !== '' && !isNaN(Number(value));
  };

  // Validation rules for each field with realistic agricultural limits
  const validationRules = {
    ph: {
      min: 0,
      max: 14,
      errorMessage: 'pH must be between 0 and 14'
    },
    nitrogen: {
      min: 0,
      max: 200,
      errorMessage: 'Nitrogen must be between 0 and 200 mg/kg'
    },
    phosphorus: {
      min: 0,
      max: 200,
      errorMessage: 'Phosphorus must be between 0 and 200 mg/kg'
    },
    potassium: {
      min: 0,
      max: 200,
      errorMessage: 'Potassium must be between 0 and 200 mg/kg'
    },
    temperature: {
      min: 0,
      max: 60,
      errorMessage: 'Temperature must be between 0 and 60°C'
    },
    humidity: {
      min: 0,
      max: 100,
      errorMessage: 'Humidity must be between 0 and 100%'
    },
    moisture: {
      min: 0,
      max: 100,
      errorMessage: 'Moisture must be between 0 and 100%'
    }
  };

  // Validate if a value is within the specified range
  type FieldName = 'ph' | 'nitrogen' | 'phosphorus' | 'potassium' | 'temperature' | 'humidity' | 'moisture';
  
  const isInRange = (value: string, fieldName: FieldName): boolean => {
    if (!validateNumber(value) || value.trim() === '') return true; // Skip empty fields
    const numValue = parseFloat(value);
    const { min, max } = validationRules[fieldName];
    return numValue >= min && numValue <= max;
  };

  // Get error message for a field
  const getErrorMessage = (value: string, fieldName: FieldName): string => {
    if (!validateNumber(value) && value.trim() !== '') {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be a number`;
    }
    if (!isInRange(value, fieldName) && value.trim() !== '') {
      return validationRules[fieldName].errorMessage;
    }
    return '';
  };

  const validateForm = () => {
    // Check if all required fields are filled
    if (!ph || !nitrogen || !phosphorus || !potassium || 
        !temperature || !humidity || !moisture) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Check if soil type and crop type are selected
    if (!soilType) {
      setError('Please select a soil type');
      return false;
    }
    
    if (!cropType) {
      setError('Please select a crop type');
      return false;
    }
    
    // Check if all values are valid numbers
    if (!validateNumber(ph) || !validateNumber(nitrogen) || 
        !validateNumber(phosphorus) || !validateNumber(potassium) || 
        !validateNumber(temperature) || !validateNumber(humidity) || 
        !validateNumber(moisture)) {
      setError('Please enter valid numbers for all fields');
      return false;
    }
    
    // Check if all values are within valid ranges
    if (!isInRange(ph, 'ph') || !isInRange(nitrogen, 'nitrogen') || 
        !isInRange(phosphorus, 'phosphorus') || !isInRange(potassium, 'potassium') || 
        !isInRange(temperature, 'temperature') || !isInRange(humidity, 'humidity') || 
        !isInRange(moisture, 'moisture')) {
      setError('Please ensure all values are within the valid ranges');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const getRecommendation = async () => {
    if (!validateForm()) {
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
      const result = await Api.predictFertilizer(requestData) as Recommendation;
      
      if (result && result.fertilizer) {
        setRecommendation(result);
        // Optionally navigate to details screen
        // navigation.navigate('Details', { type: 'fertilizer', data: result });
      } else {
        setError('Received invalid response from server. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Error getting fertilizer recommendation:', error);
      
      // Define an interface for API errors
      interface ApiError {
        message?: string;
        response?: {
          status: number;
          data: {
            error?: string;
          };
        };
      }
      
      // Check if it's a network error
      const apiError = error as ApiError;
      if (apiError.message && apiError.message.includes('Network Error')) {
        setError('Cannot connect to fertilizer service. Please check your network connection and ensure the server is running.');
      } else if (apiError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${apiError.response.status} - ${apiError.response.data.error || 'Unknown error'}`);
      } else {
        setError('Failed to get recommendation. Please try again.');
      }
      
      // Show more detailed error for debugging
      console.log('Error details:', error instanceof Error ? error.message : String(error));
      if (__DEV__) {
        Alert.alert(
          'API Error',
          `Failed to connect to API server: ${error instanceof Error ? error.message : String(error)}\n\nCheck your network connection and server status.\n\nURL: ${Api.getFertilizerUrl()}`
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
                  label="pH (0-14)"
                  value={ph}
                  onChangeText={setPh}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={ph !== '' && (!validateNumber(ph) || !isInRange(ph, 'ph'))}
                  left={<TextInput.Icon icon="flask" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={ph !== '' && (!validateNumber(ph) || !isInRange(ph, 'ph'))}>
                  {getErrorMessage(ph, 'ph')}
                </HelperText>
              </View>
              
              <View style={styles.inputColumn}>
                <TextInput
                  label="Temperature (0-60°C)"
                  value={temperature}
                  onChangeText={setTemperature}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={temperature !== '' && (!validateNumber(temperature) || !isInRange(temperature, 'temperature'))}
                  left={<TextInput.Icon icon="thermometer" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={temperature !== '' && (!validateNumber(temperature) || !isInRange(temperature, 'temperature'))}>
                  {getErrorMessage(temperature, 'temperature')}
                </HelperText>
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <TextInput
                  label="Humidity (0-100%)"
                  value={humidity}
                  onChangeText={setHumidity}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={humidity !== '' && (!validateNumber(humidity) || !isInRange(humidity, 'humidity'))}
                  left={<TextInput.Icon icon="water-percent" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={humidity !== '' && (!validateNumber(humidity) || !isInRange(humidity, 'humidity'))}>
                  {getErrorMessage(humidity, 'humidity')}
                </HelperText>
              </View>
              
              <View style={styles.inputColumn}>
                <TextInput
                  label="Moisture (0-100%)"
                  value={moisture}
                  onChangeText={setMoisture}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={moisture !== '' && (!validateNumber(moisture) || !isInRange(moisture, 'moisture'))}
                  left={<TextInput.Icon icon="water-outline" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={moisture !== '' && (!validateNumber(moisture) || !isInRange(moisture, 'moisture'))}>
                  {getErrorMessage(moisture, 'moisture')}
                </HelperText>
              </View>
            </View>
            
            <Subheading style={styles.sectionTitle}>Nutrient Levels</Subheading>
            <Divider style={styles.divider} />
            
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <TextInput
                  label="Nitrogen (N) (0-200 mg/kg)"
                  value={nitrogen}
                  onChangeText={setNitrogen}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={nitrogen !== '' && (!validateNumber(nitrogen) || !isInRange(nitrogen, 'nitrogen'))}
                  left={<TextInput.Icon icon="alpha-n-circle" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={nitrogen !== '' && (!validateNumber(nitrogen) || !isInRange(nitrogen, 'nitrogen'))}>
                  {getErrorMessage(nitrogen, 'nitrogen')}
                </HelperText>
              </View>
              
              <View style={styles.inputColumn}>
                <TextInput
                  label="Phosphorus (P) (0-200 mg/kg)"
                  value={phosphorus}
                  onChangeText={setPhosphorus}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={phosphorus !== '' && (!validateNumber(phosphorus) || !isInRange(phosphorus, 'phosphorus'))}
                  left={<TextInput.Icon icon="alpha-p-circle" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={phosphorus !== '' && (!validateNumber(phosphorus) || !isInRange(phosphorus, 'phosphorus'))}>
                  {getErrorMessage(phosphorus, 'phosphorus')}
                </HelperText>
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputColumn}>
                <TextInput
                  label="Potassium (K) (0-200 mg/kg)"
                  value={potassium}
                  onChangeText={setPotassium}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={potassium !== '' && (!validateNumber(potassium) || !isInRange(potassium, 'potassium'))}
                  left={<TextInput.Icon icon="alpha-k-circle" color={theme.colors.primary} />}
                  theme={{ colors: { primary: theme.colors.primary }}}
                />
                <HelperText type="error" visible={potassium !== '' && (!validateNumber(potassium) || !isInRange(potassium, 'potassium'))}>
                  {getErrorMessage(potassium, 'potassium')}
                </HelperText>
              </View>
            </View>
            
            <Subheading style={styles.sectionTitle}>Soil & Crop Types</Subheading>
            <Divider style={styles.divider} />
            
            {/* Soil Type Dropdown */}
            <View style={styles.menuContainer}>
              <Button 
                mode="outlined" 
                onPress={() => setSoilMenuVisible(true)}
                style={[styles.dropdown, !soilType && error ? styles.errorInput : null]}
                icon="soil"
                contentStyle={styles.dropdownContent}
                labelStyle={styles.dropdownLabel}
                color={theme.colors.primary}
              >
                {soilType || "Select Soil Type *"}
              </Button>
              <Menu
                visible={soilMenuVisible}
                onDismiss={() => setSoilMenuVisible(false)}
                anchor={{ x: 0, y: 0 }}
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
              {!soilType && error ? <HelperText type="error">Soil type is required</HelperText> : null}
            </View>
            
            {/* Crop Type Dropdown */}
            <View style={styles.menuContainer}>
              <Button 
                mode="outlined" 
                onPress={() => setCropMenuVisible(true)}
                style={[styles.dropdown, !cropType && error ? styles.errorInput : null]}
                icon="seed"
                contentStyle={styles.dropdownContent}
                labelStyle={styles.dropdownLabel}
                color={theme.colors.primary}
              >
                {cropType || "Select Crop Type *"}
              </Button>
              <Menu
                visible={cropMenuVisible}
                onDismiss={() => setCropMenuVisible(false)}
                anchor={{ x: 0, y: 0 }}
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
              {!cropType && error ? <HelperText type="error">Crop type is required</HelperText> : null}
            </View>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={getRecommendation}
                loading={loading}
                disabled={loading || !ph || !nitrogen || !phosphorus || !potassium || !temperature || !humidity || !moisture || !soilType || !cropType || 
                  !validateNumber(ph) || !validateNumber(nitrogen) || !validateNumber(phosphorus) || !validateNumber(potassium) || 
                  !validateNumber(temperature) || !validateNumber(humidity) || !validateNumber(moisture) || 
                  !isInRange(ph, 'ph') || !isInRange(nitrogen, 'nitrogen') || !isInRange(phosphorus, 'phosphorus') || 
                  !isInRange(potassium, 'potassium') || !isInRange(temperature, 'temperature') || 
                  !isInRange(humidity, 'humidity') || !isInRange(moisture, 'moisture')}
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
                color={theme.colors.onSurface}
              >
                Reset Form
              </Button>
            </View>
          </Card.Content>
        </Card>
        
        {/* Recommendation Results */}
        {recommendation && (
          <Card style={styles.card}>
            <Card.Title title="Fertilizer Recommendation" />
            <Card.Content>
              <Text style={styles.resultTitle}>{recommendation.fertilizer}</Text>
              {recommendation.description && (
                <Text style={styles.resultContent}>{recommendation.description}</Text>
              )}
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