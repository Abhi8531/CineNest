import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import localStorageService from '../services/localStorageService';

// Async thunk for loading user data from IP-based local storage
export const loadUserData = createAsyncThunk(
    'cineNest/loadUserData',
    async (_, { rejectWithValue }) => {
        try {
            // Wait for IP to be initialized
            while (!localStorageService.ipAddress) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            const userData = localStorageService.loadUserData();
            return userData;
        } catch (error) {
            console.warn('❌ Load failed:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for saving user data to IP-based local storage
export const saveUserData = createAsyncThunk(
    'cineNest/saveUserData',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState().cineNest;
            const userData = {
                watchlist: state.watchlist,
                favorites: state.favorites,
                collections: state.collections,
                viewingHistory: state.userPreferences.viewingHistory,
                preferences: { 
                    theme: state.theme,
                    preferredGenres: state.userPreferences.preferredGenres
                },
                username: state.username
            };
            
            const success = localStorageService.saveUserData(userData);
            if (!success) {
                throw new Error('Failed to save data to local storage');
            }
            
            return userData;
        } catch (error) {
            console.warn('❌ Save failed:', error);
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    bannerData: [],
    imageURL: "",
    watchlist: [],
    favorites: [],
    theme: 'dark',
    userPreferences: {
        preferredGenres: [],
        viewingHistory: [],
        recommendations: []
    },
    collections: [
        { id: 1, name: "Weekend Favorites", movies: [], description: "Perfect for weekend movie nights" },
        { id: 2, name: "Action Pack", movies: [], description: "High-octane action movies" },
        { id: 3, name: "Feel Good", movies: [], description: "Movies that make you smile" }
    ],
    // User data
    username: null,
    isFirstTimeUser: true,
    // Loading state
    isLoading: false,
    lastSaveTime: null,
    saveError: null
}

export const cineNestSlice = createSlice({
    name: 'cineNest',
    initialState,
    reducers: {
        setBannerData: (state, action) => {
            state.bannerData = action.payload
        },
        setImageURL: (state, action) => {
            state.imageURL = action.payload
        },
        addToWatchlist: (state, action) => {
            const movie = action.payload
            const exists = state.watchlist.find(item => item.id === movie.id)
            if (!exists) {
                state.watchlist.push({ ...movie, addedAt: new Date().toISOString() })
            }
        },
        removeFromWatchlist: (state, action) => {
            state.watchlist = state.watchlist.filter(item => item.id !== action.payload)
        },
        addToFavorites: (state, action) => {
            const movie = action.payload
            const exists = state.favorites.find(item => item.id === movie.id)
            if (!exists) {
                state.favorites.push({ ...movie, addedAt: new Date().toISOString() })
            }
        },
        removeFromFavorites: (state, action) => {
            state.favorites = state.favorites.filter(item => item.id !== action.payload)
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark'
        },
        setTheme: (state, action) => {
            state.theme = action.payload
        },
        addToCollection: (state, action) => {
            const { collectionId, movie } = action.payload
            const collection = state.collections.find(c => c.id === collectionId)
            if (collection && !collection.movies.find(m => m.id === movie.id)) {
                collection.movies.push(movie)
            }
        },
        removeFromCollection: (state, action) => {
            const { collectionId, movieId } = action.payload
            const collection = state.collections.find(c => c.id === collectionId)
            if (collection) {
                collection.movies = collection.movies.filter(m => m.id !== movieId)
            }
        },
        createCollection: (state, action) => {
            const newCollection = {
                id: Date.now(),
                name: action.payload.name,
                description: action.payload.description,
                movies: [],
                createdAt: new Date().toISOString()
            }
            state.collections.push(newCollection)
        },
        updateViewingHistory: (state, action) => {
            const movie = action.payload
            const history = state.userPreferences.viewingHistory
            const existingIndex = history.findIndex(item => item.id === movie.id)
            
            if (existingIndex !== -1) {
                history.splice(existingIndex, 1)
            }
            
            history.unshift({ ...movie, viewedAt: new Date().toISOString() })
            
            // Keep only last 50 items
            if (history.length > 50) {
                history.splice(50)
            }
        },
        // Username and first-time user actions
        setUsername: (state, action) => {
            state.username = action.payload
            state.isFirstTimeUser = false
        },
        setFirstTimeUserComplete: (state) => {
            state.isFirstTimeUser = false
        },
        // Initialize app with user data
        initializeUserData: (state, action) => {
            const data = action.payload
            if (data) {
                state.watchlist = data.watchlist || state.watchlist
                state.favorites = data.favorites || state.favorites
                state.collections = data.collections || state.collections
                state.userPreferences.viewingHistory = data.viewingHistory || state.userPreferences.viewingHistory
                if (data.preferences) {
                    state.theme = data.preferences.theme || state.theme
                    state.userPreferences.preferredGenres = data.preferences.preferredGenres || state.userPreferences.preferredGenres
                }
                if (data.username) {
                    state.username = data.username
                    state.isFirstTimeUser = false
                } else {
                    state.isFirstTimeUser = !localStorageService.hasUserData()
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Load user data
            .addCase(loadUserData.pending, (state) => {
                state.isLoading = true
                state.saveError = null
            })
            .addCase(loadUserData.fulfilled, (state, action) => {
                state.isLoading = false
                
                const data = action.payload
                if (data) {
                    state.watchlist = data.watchlist || state.watchlist
                    state.favorites = data.favorites || state.favorites
                    state.collections = data.collections || state.collections
                    state.userPreferences.viewingHistory = data.viewingHistory || state.userPreferences.viewingHistory
                    if (data.preferences) {
                        state.theme = data.preferences.theme || state.theme
                        state.userPreferences.preferredGenres = data.preferences.preferredGenres || state.userPreferences.preferredGenres
                    }
                    if (data.username) {
                        state.username = data.username
                        state.isFirstTimeUser = false
                    }
                }
            })
            .addCase(loadUserData.rejected, (state, action) => {
                state.isLoading = false
                state.saveError = action.payload
            })
            
            // Save user data
            .addCase(saveUserData.fulfilled, (state) => {
                state.lastSaveTime = new Date().toISOString()
            })
            .addCase(saveUserData.rejected, (state, action) => {
                state.saveError = action.payload
            })
    }
})

export const { 
    setBannerData, 
    setImageURL, 
    addToWatchlist, 
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    toggleTheme,
    setTheme,
    addToCollection,
    removeFromCollection,
    createCollection,
    updateViewingHistory,
    setUsername,
    setFirstTimeUserComplete,
    initializeUserData
} = cineNestSlice.actions

export default cineNestSlice.reducer
