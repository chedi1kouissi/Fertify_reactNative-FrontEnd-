import axios from 'axios';
import Constants from 'expo-constants';

// Configuration for different environments
const ENV = {
  dev: {
    apiUrl: 'http://172.20.10.4', // Updated with your computer's IP address from ipconfig
    fertilizerPort: '5001',
    diseasePort: '5002',
    fertilizerPath: '/api/predict_fertilizer',
    diseasePath: '/api/predict_disease'
  },
  prod: {
    apiUrl: 'https://your-production-api.com',
    fertilizerPath: '/api/predict_fertilizer',
    diseasePath: '/api/predict_disease'
  }
};

// Get the current environment
const getEnvironment = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

const environment = getEnvironment();

// Create API service
const Api = {
  // Function to set a custom API URL (e.g., when using ngrok)
  setCustomApiUrl: (url) => {
    if (url) {
      environment.apiUrl = url;
      console.log(`API URL set to: ${url}`);
    }
  },

  // Get the full URL for fertilizer prediction
  getFertilizerUrl: () => {
    const { apiUrl, fertilizerPort, fertilizerPath } = environment;
    const url = fertilizerPort 
      ? `${apiUrl}:${fertilizerPort}${fertilizerPath}`
      : `${apiUrl}${fertilizerPath}`;
    console.log('Fertilizer URL:', url);
    return url;
  },

  // Get the full URL for disease prediction
  getDiseaseUrl: () => {
    const { apiUrl, diseasePort, diseasePath } = environment;
    const url = diseasePort 
      ? `${apiUrl}:${diseasePort}${diseasePath}`
      : `${apiUrl}${diseasePath}`;
    console.log('Disease URL:', url);
    return url;
  },

  // DEBUG: Verify API connection for fertilizer service using direct URL
  checkFertilizerConnection: async () => {
    try {
      // Directly try the root endpoint
      const baseUrl = `${environment.apiUrl}:${environment.fertilizerPort}`;
      console.log('Checking fertilizer connection at:', baseUrl);
      
      // Simple GET request to the root endpoint
      const response = await axios.get(baseUrl, { 
        timeout: 10000, // Longer timeout for potential slow connections
        headers: { 'Accept': 'application/json' }
      });
      
      console.log('Fertilizer service response:', response.status, response.statusText);
      return { 
        success: true, 
        url: baseUrl,
        status: response.status,
        data: response.data 
      };
    } catch (error) {
      console.error('Error connecting to fertilizer API:', error.message);
      console.error('Error details:', error.response?.data || 'No response data');
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data 
      };
    }
  },

  // DEBUG: Verify API connection for disease service using direct URL
  checkDiseaseConnection: async () => {
    try {
      // Directly try the root endpoint
      const baseUrl = `${environment.apiUrl}:${environment.diseasePort}`;
      console.log('Checking disease connection at:', baseUrl);
      
      // Simple GET request to the root endpoint
      const response = await axios.get(baseUrl, { 
        timeout: 10000, // Longer timeout for potential slow connections
        headers: { 'Accept': 'application/json' }
      });
      
      console.log('Disease service response:', response.status, response.statusText);
      return { 
        success: true, 
        url: baseUrl,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error('Error connecting to disease API:', error.message);
      console.error('Error details:', error.response?.data || 'No response data');
      return { 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      };
    }
  },

  // Predict fertilizer with enhanced error handling
  predictFertilizer: async (data) => {
    try {
      console.log('Sending fertilizer prediction request to:', Api.getFertilizerUrl());
      console.log('Data:', JSON.stringify(data));
      
      const response = await axios.post(
        Api.getFertilizerUrl(),
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        }
      );
      
      console.log('Fertilizer response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error predicting fertilizer:', error.message);
      console.error('Error details:', error.response?.data || 'No response data');
      // Re-throw with more details
      throw error;
    }
  },

  // Predict disease with enhanced error handling and file upload
  predictDisease: async (formData) => {
    try {
      console.log('Sending disease prediction request to:', Api.getDiseaseUrl());
      
      // Log what's in the formData to help debug
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      // Ensure 'image' field exists in formData
      const formDataEntries = Array.from(formData.entries());
      const hasImageField = formDataEntries.some(entry => entry[0] === 'image');
      
      if (!hasImageField) {
        console.error('No image field found in formData');
        throw new Error('Image field missing in form data');
      }
      
      const response = await axios.post(
        Api.getDiseaseUrl(),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          timeout: 60000, // 60 seconds timeout for image processing
          transformRequest: (data, headers) => {
            // Return the formData directly, don't let axios transform it
            return formData;
          }
        }
      );
      
      console.log('Disease response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error predicting disease:', error.message);
      console.error('Error details:', error.response?.data || 'No response data');
      // Re-throw with more details
      throw error;
    }
  },
  
  // Predict disease using base64 encoded image
  predictDiseaseWithBase64: async (base64Image) => {
    try {
      const url = `${environment.apiUrl}:${environment.diseasePort}/api/predict_disease_base64`;
      console.log('Sending base64 disease prediction request to:', url);
      
      const response = await axios.post(
        url,
        { image_base64: base64Image },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 60000 // 60 seconds timeout for image processing
        }
      );
      
      console.log('Disease response from base64 endpoint:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error predicting disease with base64:', error.message);
      console.error('Error details:', error.response?.data || 'No response data');
      // Re-throw with more details
      throw error;
    }
  }
};

export default Api; 