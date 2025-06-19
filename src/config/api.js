// API Configuration with cross-browser compatibility
export const API_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  
  // TMDB API Token - Add your token here for production
  ACCESS_TOKEN: process.env.REACT_APP_ACCESS_TOKEN || 
                // Production fallback - Replace with your actual token
                'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDNjMTYyNjBhMGY4NzA4Y2M3YmJlNzNjOWU2OGU4YyIsIm5iZiI6MTcxODI5ODc5MS42MzU5NzUsInN1YiI6IjY2NmFkNDZmNDUwNzUwMmU5OWI5MzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3M9XG1TJ2FqTNTCNO2V3y_EGadmzV-IWdcTRZ5qJHx0',
  
  // Image configuration
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/',
  
  // Default request headers with better cross-browser support
  getHeaders: function() {
    return {
      'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    }
  },
  
  // Enhanced axios configuration for cross-browser compatibility
  getAxiosConfig: function() {
    return {
      timeout: 30000, // Increased timeout for slower connections
      headers: this.getHeaders(),
      withCredentials: false, // Disable credentials for CORS
      maxRedirects: 5,
      validateStatus: function (status) {
        return status < 500; // Resolve only if status is less than 500
      }
    }
  },
  
  // Check if API is configured
  isConfigured: function() {
    return !!this.ACCESS_TOKEN && this.ACCESS_TOKEN !== 'your_tmdb_access_token_here'
  },
  
  // Test API connectivity with multiple fallback methods
  testConnection: async function() {
    // Use dynamic import to avoid module resolution issues
    const axios = (await import('axios')).default;
    
    const testMethods = [
      // Method 1: Using enhanced axios config (without custom adapter)
      () => axios.get(`${this.BASE_URL}/configuration`, this.getAxiosConfig()),
      
      // Method 2: Simplified call without custom config
      () => axios.get(`${this.BASE_URL}/configuration`, {
        timeout: 15000,
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Accept': 'application/json'
        },
        withCredentials: false
      }),
      
      // Method 3: Basic call with minimal configuration
      () => axios.get(`${this.BASE_URL}/configuration`, {
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`
        }
      })
    ];
    
    for (let i = 0; i < testMethods.length; i++) {
      try {
        console.log(`🔍 Testing API connection method ${i + 1}...`);
        const response = await testMethods[i]();
        if (response.status === 200) {
          console.log(`✅ API connection successful with method ${i + 1}`);
          return { success: true, method: i + 1, data: response.data };
        }
      } catch (error) {
        console.warn(`⚠️ Method ${i + 1} failed:`, error.message);
      }
    }
    
    return { success: false, error: 'All connection methods failed' };
  }
}

export default API_CONFIG 