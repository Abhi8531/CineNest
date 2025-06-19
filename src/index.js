import './polyfills';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { store } from './store/store';
import { Provider } from 'react-redux';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import API_CONFIG from './config/api';

// Add global axios reference for better cross-browser compatibility
window.axios = axios;

/**setup axios with cross-browser compatibility */
axios.defaults.baseURL = API_CONFIG.BASE_URL
axios.defaults.timeout = 30000 // Increased timeout
axios.defaults.withCredentials = false // Disable credentials for CORS

// Enhanced axios configuration for cross-browser support
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'

// Set authorization header using centralized config
if (API_CONFIG.isConfigured()) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${API_CONFIG.ACCESS_TOKEN}`
  console.log('✅ TMDB API configured successfully')
} else {
  console.error('❌ TMDB API token is not configured. Please check your environment variables.')
}

// Add axios interceptors for better error handling and cross-browser compatibility
axios.interceptors.request.use(
  (config) => {
    // Ensure proper headers for all browsers
    config.headers = {
      ...config.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    
    // Log request for debugging
    console.log('🌐 Making API request:', config.url)
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    console.log('✅ API response received:', response.config.url)
    return response
  },
  (error) => {
    console.error('❌ API response error:', error.message)
    
    // Enhanced error handling for different browsers
    if (error.code === 'ECONNABORTED') {
      console.error('🕐 Request timeout - try refreshing the page')
    } else if (error.message && error.message.includes('Network Error')) {
      console.error('🌐 Network error - check your internet connection')
    } else if (error.response && error.response.status === 0) {
      console.error('🚫 CORS or network error - API not accessible')
    }
    
    return Promise.reject(error)
  }
)

// Cross-browser compatibility check
const checkBrowserCompatibility = () => {
  const warnings = [];
  
  // Check for essential features
  if (!window.fetch) {
    warnings.push('Fetch API not supported - using axios instead');
  }
  
  if (!window.Promise) {
    warnings.push('Promises not supported - please use a modern browser');
  }
  
  if (!window.localStorage) {
    warnings.push('LocalStorage not supported - some features may not work');
  }
  
  if (!window.XMLHttpRequest) {
    warnings.push('XMLHttpRequest not supported - API calls may fail');
  }
  
  // Check for CORS support
  if (!('withCredentials' in new XMLHttpRequest())) {
    warnings.push('CORS not supported - API calls may be restricted');
  }
  
  if (warnings.length > 0) {
    console.warn('🔧 Browser compatibility warnings:', warnings);
  } else {
    console.log('✅ Browser compatibility check passed');
  }
  
  return warnings.length === 0;
};

// Enhanced browser detection
const detectBrowser = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  let browser = 'Unknown';
  if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
  else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) browser = 'Internet Explorer';
  
  console.log(`🌐 Detected browser: ${browser}`);
  return browser;
};

// Run compatibility checks
checkBrowserCompatibility();
detectBrowser();

// Test API connection on startup
const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    const result = await API_CONFIG.testConnection();
    if (result.success) {
      console.log(`✅ API test successful using method ${result.method}`);
    } else {
      console.error('❌ API test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ API test error:', error.message);
  }
};

// Test API after a short delay to ensure everything is loaded
setTimeout(testApiConnection, 1000);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
