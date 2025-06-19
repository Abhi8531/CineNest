import { configureStore } from '@reduxjs/toolkit'
import cineNestReducer from './CineSlice'
import { saveUserData } from './CineSlice'

// Auto-save middleware for local storage
const autoSaveMiddleware = (store) => (next) => (action) => {
    // Execute the action first
    const result = next(action);
    
    // Actions that should trigger auto-save
    const ACTIONS_TO_SAVE = [
        'cineNest/addToWatchlist',
        'cineNest/removeFromWatchlist',
        'cineNest/addToFavorites',
        'cineNest/removeFromFavorites',
        'cineNest/addToCollection',
        'cineNest/removeFromCollection',
        'cineNest/createCollection',
        'cineNest/updateViewingHistory',
        'cineNest/setTheme',
        'cineNest/toggleTheme',
        'cineNest/setUsername'
    ];
    
    // Auto-save data after state changes (debounced)
    if (ACTIONS_TO_SAVE.includes(action.type)) {
        // Clear existing timeout
        if (autoSaveMiddleware.saveTimeout) {
            clearTimeout(autoSaveMiddleware.saveTimeout);
        }
        
        // Set new timeout for debounced save (1 second delay)
        autoSaveMiddleware.saveTimeout = setTimeout(() => {
            console.log('💾 Auto-saving due to action:', action.type);
            store.dispatch(saveUserData());
        }, 1000);
    }
    
    return result;
};

export const store = configureStore({
  reducer: {
    cineNest: cineNestReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serializable check
        ignoredPaths: ['cineNest.lastSaveTime'],
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(autoSaveMiddleware),
})