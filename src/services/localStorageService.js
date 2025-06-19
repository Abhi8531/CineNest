import axios from 'axios';

// Local storage service with IP-based user identification
class LocalStorageService {
  constructor() {
    this.ipAddress = null;
    this.storageKey = 'cineNest_userData';
    this.initializeIP();
  }

  // Get user's IP address using a public API with axios for better compatibility
  async initializeIP() {
    try {
      // Try multiple IP services for reliability using axios
      const ipServices = [
        'https://api.ipify.org?format=json',
        'https://httpbin.org/ip',
        'https://api.myip.com'
      ];

      for (const service of ipServices) {
        try {
          const response = await axios.get(service, {
            timeout: 5000,
            headers: {
              'Accept': 'application/json'
            }
          });
          const data = response.data;
          
          // Extract IP from different response formats
          this.ipAddress = data.ip || data.origin || data.query;
          
          if (this.ipAddress) {
            console.log('✅ IP address detected:', this.ipAddress);
            break;
          }
        } catch (error) {
          console.warn('⚠️ IP service failed:', service, error.message);
        }
      }

      // Fallback: use a simple hash based on browser fingerprint
      if (!this.ipAddress) {
        this.ipAddress = this.generateBrowserFingerprint();
        console.log('📱 Using browser fingerprint as IP fallback:', this.ipAddress);
      }
    } catch (error) {
      console.warn('⚠️ Could not determine IP address, using fallback');
      this.ipAddress = this.generateBrowserFingerprint();
    }
  }

  // Generate a browser fingerprint as IP fallback with better cross-browser support
  generateBrowserFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
      }
      
      const fingerprint = [
        navigator.userAgent || 'unknown',
        navigator.language || 'unknown',
        (window.screen.width || 0) + 'x' + (window.screen.height || 0),
        new Date().getTimezoneOffset() || 0,
        ctx ? canvas.toDataURL() : 'no-canvas'
      ].join('|');
      
      // Simple hash function
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return 'fp_' + Math.abs(hash).toString(36);
    } catch (error) {
      console.warn('⚠️ Fingerprint generation failed, using fallback');
      return 'fp_' + Math.random().toString(36).substr(2, 9);
    }
  }

  // Get storage key based on IP address
  getStorageKey() {
    return `${this.storageKey}_${this.ipAddress || 'unknown'}`;
  }

  // Save user data to localStorage
  saveUserData(userData) {
    try {
      const key = this.getStorageKey();
      const dataToSave = {
        ...userData,
        lastUpdated: new Date().toISOString(),
        ipAddress: this.ipAddress
      };
      
      localStorage.setItem(key, JSON.stringify(dataToSave));
      console.log('💾 User data saved for IP:', this.ipAddress);
      return true;
    } catch (error) {
      console.error('❌ Failed to save user data:', error);
      return false;
    }
  }

  // Load user data from localStorage
  loadUserData() {
    try {
      const key = this.getStorageKey();
      const savedData = localStorage.getItem(key);
      
      if (savedData) {
        const userData = JSON.parse(savedData);
        console.log('📥 User data loaded for IP:', this.ipAddress);
        return userData;
      }
      
      console.log('📄 No saved data found for IP:', this.ipAddress);
      return null;
    } catch (error) {
      console.error('❌ Failed to load user data:', error);
      return null;
    }
  }

  // Check if user has saved data
  hasUserData() {
    const key = this.getStorageKey();
    return localStorage.getItem(key) !== null;
  }

  // Clear user data
  clearUserData() {
    try {
      const key = this.getStorageKey();
      localStorage.removeItem(key);
      console.log('🧹 User data cleared for IP:', this.ipAddress);
      return true;
    } catch (error) {
      console.error('❌ Failed to clear user data:', error);
      return false;
    }
  }

  // Get all saved IPs (for debugging)
  getAllSavedIPs() {
    const allKeys = Object.keys(localStorage);
    const cineNestKeys = allKeys.filter(key => key.startsWith(this.storageKey));
    return cineNestKeys.map(key => key.replace(this.storageKey + '_', ''));
  }

  // Migrate old localStorage data to IP-based storage
  migrateOldData() {
    try {
      const oldData = {
        watchlist: JSON.parse(localStorage.getItem('cineNestWatchlist') || '[]'),
        favorites: JSON.parse(localStorage.getItem('cineNestFavorites') || '[]'),
        collections: JSON.parse(localStorage.getItem('cineNestCollections') || '[]'),
        theme: localStorage.getItem('cineNestTheme') || 'dark',
        username: localStorage.getItem('cineNestUsername'),
        lastSync: localStorage.getItem('cineNestLastSync')
      };

      // Only migrate if there's actual data
      const hasOldData = oldData.watchlist.length > 0 || 
                        oldData.favorites.length > 0 || 
                        oldData.username ||
                        oldData.collections.length > 3; // More than default collections

      if (hasOldData) {
        console.log('🔄 Migrating old localStorage data to IP-based storage');
        this.saveUserData(oldData);
        
        // Clean up old keys
        localStorage.removeItem('cineNestWatchlist');
        localStorage.removeItem('cineNestFavorites');
        localStorage.removeItem('cineNestCollections');
        localStorage.removeItem('cineNestUsername');
        localStorage.removeItem('cineNestLastSync');
        localStorage.removeItem('cineNestFirstTime');
        
        console.log('✅ Migration completed');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const localStorageService = new LocalStorageService();

export default localStorageService; 