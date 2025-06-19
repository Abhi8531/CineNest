// Utility functions for user management with IP-based local storage
import localStorageService from '../services/localStorageService';

export const isFirstTimeUser = () => {
  // Wait for IP to be initialized
  if (!localStorageService.ipAddress) {
    return true; // Default to first-time until we can check properly
  }
  
  const userData = localStorageService.loadUserData();
  const isFirstTime = !userData || (!userData.username && !userData.hasCompletedWelcome);
  
  console.log('🔍 First-time user check:', {
    hasUserData: !!userData,
    username: userData?.username,
    isFirstTime
  });
  
  return isFirstTime;
};

export const markUserAsReturning = () => {
  const userData = localStorageService.loadUserData() || {};
  userData.hasCompletedWelcome = true;
  localStorageService.saveUserData(userData);
  console.log('✅ User marked as returning');
};

export const setUserName = (name) => {
  const userData = localStorageService.loadUserData() || {};
  userData.username = name;
  userData.hasCompletedWelcome = true;
  localStorageService.saveUserData(userData);
  console.log(`✅ Username set: ${name}`);
};

export const getUserName = () => {
  const userData = localStorageService.loadUserData();
  return userData?.username || null;
};

export const clearUserData = () => {
  localStorageService.clearUserData();
  console.log('🧹 User data cleared');
};

export const shouldShowWelcomeModal = () => {
  const isFirst = isFirstTimeUser();
  const hasUsername = getUserName();
  
  console.log('🎯 Should show welcome modal:', {
    isFirstTime: isFirst,
    hasUsername: !!hasUsername,
    shouldShow: isFirst && !hasUsername
  });
  
  return isFirst && !hasUsername;
};

// Helper to get user's IP address for debugging
export const getUserIP = () => {
  return localStorageService.ipAddress;
};

// Helper to check if user data exists
export const hasUserData = () => {
  return localStorageService.hasUserData();
}; 