import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBannerData, setImageURL, loadUserData } from './store/CineSlice';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import useErrorHandler from './hooks/useErrorHandler';
import ApiHealthChecker from './components/ApiHealthChecker';
import localStorageService from './services/localStorageService';
import toast from 'react-hot-toast';
import WelcomeModal from './components/WelcomeModal';
import ScrollToTop from './components/ScrollToTop';
import BackToTopButton from './components/BackToTopButton';
import { shouldShowWelcomeModal } from './utils/userUtils';

function App() {
  const dispatch = useDispatch()
  const theme = useSelector(state => state.cineNest.theme)
  const { handleApiError, checkApiHealth } = useErrorHandler()
  
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [initError, setInitError] = useState(null)
  const [apiHealth, setApiHealth] = useState(null)
  const [debugInfo, setDebugInfo] = useState({})
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  // Enhanced API validation
  const validateApiSetup = () => {
    const token = process.env.REACT_APP_ACCESS_TOKEN
    console.group('🔍 API Setup Validation')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('API Token exists:', !!token)
    console.log('API Token length:', token?.length || 0)
    console.log('Axios base URL:', axios.defaults.baseURL)
    console.log('Axios default headers:', axios.defaults.headers.common)
    console.groupEnd()
    
    setDebugInfo({
      hasToken: !!token,
      tokenLength: token?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      baseUrl: axios.defaults.baseURL
    })
    
    return !!token
  }

  const fetchTrendingData = async() => {
    try {
        console.log('🚀 Fetching trending data...')
        const response = await axios.get('/trending/all/week', {
          timeout: 15000,
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
          }
        })
        
        console.log('✅ Trending data response:', response.data)
        dispatch(setBannerData(response.data.results))
        return true
    } catch (error) {
        console.error("❌ Trending data error:", error)
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        })
        handleApiError(error, 'Failed to load trending content')
        return false
    }
  }

  const fetchConfiguration = async() => {
    try {
        console.log('🚀 Fetching TMDB configuration...')
        const response = await axios.get("/configuration", {
          timeout: 15000,
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
          }
        })
        
        console.log('✅ Configuration response:', response.data)
        dispatch(setImageURL(response.data.images.secure_base_url + "original"))
        return true
    } catch (error) {
        console.error("❌ Configuration error:", error)
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        })
        handleApiError(error, 'Failed to load configuration')
        return false
    }
  }

  // Initialize user data from local storage
  const initializeUserDataFromStorage = async () => {
    try {
      console.log('📱 Initializing user data from local storage...')
      
      // Check if we need to migrate old data first
      const migrated = localStorageService.migrateOldData()
      if (migrated) {
        toast.success('📱 Your data has been migrated to the new storage system!', {
          duration: 4000,
          icon: '🔄',
        })
      }
      
      // Load user data
      const userData = await dispatch(loadUserData()).unwrap()
      
      if (userData) {
        const hasData = userData && (
          (userData.watchlist && userData.watchlist.length > 0) ||
          (userData.favorites && userData.favorites.length > 0) ||
          (userData.collections && userData.collections.length > 3) || // More than default
          userData.username
        )
        
        if (hasData) {
          toast.success('✅ Your saved data has been restored!', {
            duration: 4000,
            icon: '🎉',
          })
        } else if (shouldShowWelcomeModal()) {
          console.log('🎉 Showing welcome modal for first-time user')
            setTimeout(() => {
              setShowWelcomeModal(true)
            }, 1500)
        }
      } else {
        // No saved data found
        console.log('📄 No saved data found, checking for first-time user')
        if (shouldShowWelcomeModal()) {
          console.log('🎉 Showing welcome modal for first-time user')
          setTimeout(() => {
            setShowWelcomeModal(true)
          }, 1500)
        }
      }
    } catch (error) {
      console.error('❌ User data initialization failed:', error)
      // Don't show error toast, just log it
    }
  }

  const initializeApp = async () => {
    try {
      console.log('🎬 Initializing CineNest App...')
      setIsInitialLoading(true)
      setInitError(null)
      
      // First validate API setup
      const hasValidSetup = validateApiSetup()
      if (!hasValidSetup) {
        throw new Error('TMDB API token is missing. Please check your environment variables.')
      }
      
      // Check API health first
      console.log('🏥 Checking API health...')
      const isHealthy = await checkApiHealth()
      setApiHealth(isHealthy)
      
      if (!isHealthy) {
        throw new Error('TMDB API is not accessible. Please check your internet connection and API token.')
      }
      
      console.log('🔄 Running initialization requests...')
      
      // Run both requests concurrently with individual error handling
      const [trendingResult, configResult] = await Promise.allSettled([
        fetchTrendingData(),
    fetchConfiguration()
      ])

      console.log('📊 Initialization results:', {
        trending: trendingResult,
        config: configResult
      })

      // App can function even if trending fails, but config is more critical
      if (configResult.status === 'rejected') {
        throw new Error('Failed to load app configuration. This is required for the app to function.')
      }

      console.log('✅ App initialization completed successfully')
      
      // Initialize user data from local storage after TMDB is ready
      setTimeout(() => {
        initializeUserDataFromStorage()
      }, 1000)

    } catch (error) {
      console.error('💥 App initialization error:', error)
      setInitError(error)
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleApiHealthChange = (isHealthy) => {
    setApiHealth(isHealthy)
    if (!isHealthy && !initError) {
      setInitError(new Error('API connection lost. Please check your internet connection.'))
    }
  }

  useEffect(() => {
    console.log('🎯 App useEffect triggered')
    
    // Enhanced environment check
    const requiredEnvVars = ['REACT_APP_ACCESS_TOKEN']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.error('🚨 Missing environment variables:', missingVars)
      setInitError(new Error(`Missing environment variables: ${missingVars.join(', ')}. Please check your .env file.`))
      setIsInitialLoading(false)
      return
    }

    initializeApp()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Apply theme to document with better transitions
    const root = document.documentElement
    const body = document.body
    
    if (theme === 'dark') {
      root.classList.add('dark')
      body.className = 'bg-neutral-900 text-neutral-300 transition-colors duration-300'
    } else {
      root.classList.remove('dark')
      body.className = 'bg-gray-50 text-gray-900 transition-colors duration-300'
    }
  }, [theme])

  // Show loading screen during initial app setup
  if (isInitialLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'
      }`}>
        <div className="text-center max-w-md px-4">
          <LoadingSpinner size="xl" text="Loading CineNest..." />
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎬</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                CineNest
              </h1>
            </div>
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your Cinema Discovery Platform
            </p>
            
            {/* Debug info during loading */}
            {debugInfo.hasToken !== undefined && (
              <div className={`mt-4 p-3 rounded-lg text-xs ${
                theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}>
                <p>Debug: API Token {debugInfo.hasToken ? '✅' : '❌'}</p>
                <p>Environment: {debugInfo.nodeEnv}</p>
                <p>Storage: Local IP-based 📱</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show error screen if initialization failed
  if (initError) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'
      }`}>
        <div className="text-center max-w-lg px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Failed to Load CineNest
          </h1>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {initError.message || 'There was a problem loading the application.'}
          </p>
          
          {/* API Health Status */}
          <div className="mb-6">
            <ApiHealthChecker onHealthCheck={handleApiHealthChange} />
          </div>
          
          <button
            onClick={initializeApp}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            Try Again
          </button>
          
          {/* Debug Information */}
          {debugInfo.hasToken !== undefined && (
            <div className={`mt-6 p-4 rounded-lg border-l-4 border-yellow-500 text-left ${
              theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-50'
            }`}>
              <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
                Debug Information:
              </h3>
              <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
                <li>• API Token: {debugInfo.hasToken ? `Present (${debugInfo.tokenLength} chars)` : 'Missing'}</li>
                <li>• Environment: {debugInfo.nodeEnv}</li>
                <li>• Base URL: {debugInfo.baseUrl}</li>
                <li>• API Health: {apiHealth === null ? 'Checking...' : apiHealth ? 'Healthy' : 'Unhealthy'}</li>
                <li>• Storage: Local IP-based 📱</li>
              </ul>
            </div>
          )}
          
          {initError.message.includes('API token') && (
            <div className={`mt-6 p-4 rounded-lg border-l-4 border-red-500 ${
              theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
            }`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>
                <strong>Setup Required:</strong> Please add your TMDB API token to your environment variables as REACT_APP_ACCESS_TOKEN.
                <br />
                <br />
                <strong>Steps to Fix:</strong>
                <br />
                1. Get your API token from <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">TMDB Settings</a>
                <br />
                2. Create or edit the <code className="bg-black/20 px-1 rounded">.env</code> file
                <br />
                3. Add this line: <code className="bg-black/20 px-1 rounded">REACT_APP_ACCESS_TOKEN=your_token_here</code>
                <br />
                4. Save the file and restart the development server with <code className="bg-black/20 px-1 rounded">npm start</code>
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <ErrorBoundary>
            <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'
      }`}>
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === 'dark' ? '#1f2937' : '#ffffff',
              color: theme === 'dark' ? '#f3f4f6' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              boxShadow: theme === 'dark' 
                ? '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)' 
                : '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
        
        {/* Scroll to top on route change */}
        <ScrollToTop />
        
        {/* Back to top button */}
        <BackToTopButton />
        
        {/* Welcome Modal for First-Time Users */}
        <WelcomeModal 
          isOpen={showWelcomeModal} 
          onClose={() => setShowWelcomeModal(false)} 
        />
        
        {/* API Health Status Bar */}
        {apiHealth === false && (
          <div className="fixed top-16 left-0 right-0 z-40">
            <div className="container mx-auto px-4">
              <ApiHealthChecker onHealthCheck={handleApiHealthChange} />
            </div>
          </div>
        )}
        
        <main className='pb-16 lg:pb-0'>
          <Header/>
          <div className={`min-h-[90vh] pt-16 ${apiHealth === false ? 'pt-32' : ''}`}>
            <ErrorBoundary>
              <Outlet/>
            </ErrorBoundary>
          </div>
          <Footer/>
          <MobileNavigation/>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
