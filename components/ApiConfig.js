import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Surface, Text, Dialog, Portal, IconButton, Chip, ActivityIndicator } from 'react-native-paper';
import Api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

const API_URL_STORAGE_KEY = 'fertify_api_url';

const ApiConfig = () => {
  const [visible, setVisible] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [status, setStatus] = useState({ success: false, message: '' });
  const [connectionStatus, setConnectionStatus] = useState({
    fertilizer: { checked: false, success: false },
    disease: { checked: false, success: false }
  });
  const [deviceIp, setDeviceIp] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Load the saved API URL on component mount
  useEffect(() => {
    loadApiUrl();
    displayLocalIpAddress();
  }, []);

  const displayLocalIpAddress = async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      console.log(`Your device IP address: ${ip}`);
      setDeviceIp(ip);
    } catch (error) {
      console.error('Could not get IP address:', error);
    }
  };

  // Save API URL to persistent storage
  const saveApiUrl = async (url) => {
    try {
      await AsyncStorage.setItem(API_URL_STORAGE_KEY, url);
    } catch (error) {
      console.error('Error saving API URL:', error);
    }
  };

  // Load API URL from persistent storage
  const loadApiUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem(API_URL_STORAGE_KEY);
      if (savedUrl) {
        setApiUrl(savedUrl);
        Api.setCustomApiUrl(savedUrl);
      }
    } catch (error) {
      console.error('Error loading API URL:', error);
    }
  };

  // Check connections to both services
  const checkApiConnections = async () => {
    setIsTestingConnection(true);
    
    // Check fertilizer connection
    setConnectionStatus(prev => ({
      ...prev,
      fertilizer: { checked: true, success: false, checking: true }
    }));
    
    try {
      const fertResult = await Api.checkFertilizerConnection();
      console.log('Fertilizer connection result:', fertResult);
      
      setConnectionStatus(prev => ({
        ...prev,
        fertilizer: { 
          checked: true, 
          success: fertResult.success,
          checking: false,
          error: fertResult.error,
          status: fertResult.status,
          data: fertResult.data
        }
      }));
    } catch (error) {
      console.error('Error during fertilizer connection check:', error);
      setConnectionStatus(prev => ({
        ...prev,
        fertilizer: { 
          checked: true, 
          success: false,
          checking: false,
          error: error.message
        }
      }));
    }
    
    // Check disease connection
    setConnectionStatus(prev => ({
      ...prev,
      disease: { checked: true, success: false, checking: true }
    }));
    
    try {
      const diseaseResult = await Api.checkDiseaseConnection();
      console.log('Disease connection result:', diseaseResult);
      
      setConnectionStatus(prev => ({
        ...prev,
        disease: { 
          checked: true, 
          success: diseaseResult.success,
          checking: false,
          error: diseaseResult.error,
          status: diseaseResult.status,
          data: diseaseResult.data
        }
      }));
    } catch (error) {
      console.error('Error during disease connection check:', error);
      setConnectionStatus(prev => ({
        ...prev,
        disease: { 
          checked: true, 
          success: false,
          checking: false,
          error: error.message
        }
      }));
    }
    
    setIsTestingConnection(false);
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleSave = async () => {
    if (apiUrl.trim()) {
      Api.setCustomApiUrl(apiUrl.trim());
      saveApiUrl(apiUrl.trim());
      setStatus({ 
        success: true, 
        message: `API URL set to: ${apiUrl.trim()}` 
      });
      
      await checkApiConnections();
    } else {
      setStatus({ 
        success: false, 
        message: 'Please enter a valid URL' 
      });
    }
    setTimeout(() => setStatus({ success: false, message: '' }), 3000);
    hideDialog();
  };

  const handleUseLocalIP = () => {
    const computerIP = '172.20.10.4'; // This is the IP from ipconfig
    setApiUrl(computerIP);
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="api"
        size={24}
        onPress={showDialog}
        style={styles.iconButton}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog} dismissable={!isTestingConnection}>
          <Dialog.Title>API Configuration</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.label}>Set API Server URL:</Text>
            <TextInput
              mode="outlined"
                label="Computer's IP Address"
              value={apiUrl}
              onChangeText={setApiUrl}
              autoCapitalize="none"
              style={styles.input}
                placeholder="Enter your computer's IP address"
              right={<TextInput.Icon name="web" />}
            />
              
              <Button 
                mode="outlined" 
                onPress={handleUseLocalIP} 
                style={styles.ipButton}
                icon="access-point-network"
              >
                Use 172.20.10.4
              </Button>
              
            <Text style={styles.helperText}>
                You need to use your computer's IP address. Your device IP is: {deviceIp}
              </Text>
              
              <Text style={styles.serviceInfo}>
                Fertilizer Service: Port 5001{'\n'}
                Disease Detection Service: Port 5002
              </Text>
              
              <Button 
                mode="contained" 
                onPress={checkApiConnections} 
                style={styles.testButton}
                loading={isTestingConnection}
                disabled={isTestingConnection || !apiUrl}
                icon="wifi"
              >
                Test Connection
              </Button>
              
              {/* Connection status indicators */}
              <View style={styles.statusChipContainer}>
                <Chip 
                  icon={connectionStatus.fertilizer.checking ? "loading" : 
                       connectionStatus.fertilizer.success ? "check-circle" : "alert-circle"}
                  style={[
                    styles.statusChip,
                    connectionStatus.fertilizer.success ? styles.successChip : 
                    connectionStatus.fertilizer.checked ? styles.errorChip : styles.pendingChip
                  ]}
                  textStyle={styles.chipText}
                >
                  {connectionStatus.fertilizer.checking ? "Checking Fertilizer API..." : 
                   connectionStatus.fertilizer.success ? "Fertilizer: Connected" : 
                   connectionStatus.fertilizer.checked ? "Fertilizer: Failed" : "Fertilizer: Not Checked"}
                </Chip>
                
                {connectionStatus.fertilizer.checked && !connectionStatus.fertilizer.success && (
                  <Text style={styles.errorDetail}>
                    Error: {connectionStatus.fertilizer.error || "Unknown connection error"}
                  </Text>
                )}
                
                <Chip 
                  icon={connectionStatus.disease.checking ? "loading" : 
                       connectionStatus.disease.success ? "check-circle" : "alert-circle"}
                  style={[
                    styles.statusChip,
                    connectionStatus.disease.success ? styles.successChip : 
                    connectionStatus.disease.checked ? styles.errorChip : styles.pendingChip
                  ]}
                  textStyle={styles.chipText}
                >
                  {connectionStatus.disease.checking ? "Checking Disease API..." : 
                   connectionStatus.disease.success ? "Disease: Connected" : 
                   connectionStatus.disease.checked ? "Disease: Failed" : "Disease: Not Checked"}
                </Chip>
                
                {connectionStatus.disease.checked && !connectionStatus.disease.success && (
                  <Text style={styles.errorDetail}>
                    Error: {connectionStatus.disease.error || "Unknown connection error"}
                  </Text>
                )}
              </View>
              
              <Text style={styles.helpText}>
                Make sure both services are running on your computer using the controller:
                {'\n\n'}
                1. Navigate to the greenAI folder
                {'\n'}
                2. Run start_services.bat (Windows) or start_services.sh (Mac/Linux)
                {'\n'}
                3. Check that both services show "Running on http://127.0.0.1:5001" and "Running on http://127.0.0.1:5002"
            </Text>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={hideDialog} disabled={isTestingConnection}>Cancel</Button>
            <Button 
              onPress={handleSave} 
              disabled={isTestingConnection || !apiUrl}
              loading={isTestingConnection}
            >
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {status.message ? (
        <Surface style={[
          styles.statusContainer, 
          status.success ? styles.successStatus : styles.errorStatus
        ]}>
          <Text style={styles.statusText}>{status.message}</Text>
        </Surface>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  dialog: {
    borderRadius: 8,
    maxHeight: '80%',
  },
  scrollContent: {
    paddingVertical: 10,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
    marginBottom: 8,
  },
  testButton: {
    marginVertical: 12,
  },
  ipButton: {
    marginBottom: 8,
  },
  serviceInfo: {
    fontSize: 12,
    marginTop: 8,
    backgroundColor: '#F1F8E9',
    padding: 8,
    borderRadius: 4,
    color: '#2E7D32',
  },
  statusChipContainer: {
    marginTop: 12,
    flexDirection: 'column',
    gap: 4,
  },
  statusChip: {
    marginVertical: 4,
  },
  successChip: {
    backgroundColor: '#4CAF50',
  },
  errorChip: {
    backgroundColor: '#F44336',
  },
  pendingChip: {
    backgroundColor: '#9E9E9E',
  },
  chipText: {
    color: 'white',
  },
  errorDetail: {
    color: '#D32F2F',
    fontSize: 12,
    marginLeft: 12,
    marginBottom: 8,
  },
  helpText: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 18,
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 4,
    color: '#1976D2',
  },
  statusContainer: {
    padding: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 60,
    right: 0,
    minWidth: 200,
  },
  successStatus: {
    backgroundColor: '#4CAF50',
  },
  errorStatus: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ApiConfig; 