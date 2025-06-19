import { useCallback } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import API_CONFIG from '../config/api'

const useErrorHandler = () => {
    // Enhanced error handler with network-specific handling
    const handleError = useCallback((error, context = '') => {
        console.error(`Error in ${context}:`, error)
        
        // Check for specific error types
        if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
            console.error('Network connectivity issue detected')
            return {
                type: 'network',
                message: 'Network connection problem. Please check your internet connection.',
                canRetry: true
            }
        }
        
        if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
            console.error('Request timeout detected')
            return {
                type: 'timeout',
                message: 'Request timed out. The server might be busy.',
                canRetry: true
            }
        }
        
        if (error?.response?.status === 401) {
            console.error('Authentication error - API token issue')
            return {
                type: 'auth',
                message: 'API authentication failed. Please check your TMDB API token.',
                canRetry: false
            }
        }
        
        if (error?.response?.status === 429) {
            console.error('Rate limiting detected')
            return {
                type: 'rate_limit',
                message: 'Too many requests. Please wait a moment and try again.',
                canRetry: true
            }
        }
        
        if (error?.response?.status >= 500) {
            console.error('Server error detected')
            return {
                type: 'server',
                message: 'Server is experiencing issues. Please try again later.',
                canRetry: true
            }
        }
        
        if (error?.response?.status === 404) {
            console.error('Resource not found')
            return {
                type: 'not_found',
                message: 'Requested content not found.',
                canRetry: false
            }
        }
        
        // Generic error
        return {
            type: 'generic',
            message: error?.message || 'An unexpected error occurred.',
            canRetry: true
        }
    }, [])

    const classifyError = (error) => {
        // Network connectivity issues
        if (error && (error.code === 'NETWORK_ERROR' || (error.message && error.message.includes('Network Error')))) {
            return {
                type: 'network',
                title: '🌐 Network Error',
                message: 'Please check your internet connection and try again.',
                action: 'retry'
            }
        }

        // Request timeout
        if (error && (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout')))) {
            return {
                type: 'timeout',
                title: '⏰ Request Timeout',
                message: 'The request took too long. Please try again.',
                action: 'retry'
            }
        }

        // Authentication errors
        if (error && error.response && error.response.status === 401) {
            return {
                type: 'auth',
                title: '🔑 Authentication Error',
                message: 'Invalid API token. Please check your configuration.',
                action: 'config'
            }
        }

        // Rate limiting
        if (error && error.response && error.response.status === 429) {
            return {
                type: 'rate_limit',
                title: '🚦 Rate Limited',
                message: 'Too many requests. Please wait a moment and try again.',
                action: 'wait'
            }
        }

        // Server errors
        if (error && error.response && error.response.status >= 500) {
            return {
                type: 'server',
                title: '🔧 Server Error',
                message: 'The server is experiencing issues. Please try again later.',
                action: 'retry'
            }
        }

        // Not found errors
        if (error && error.response && error.response.status === 404) {
            return {
                type: 'not_found',
                title: '🔍 Not Found',
                message: 'The requested content was not found.',
                action: 'none'
            }
        }

        // CORS errors
        if (error && error.response && error.response.status === 0) {
            return {
                type: 'cors',
                title: '🚫 Connection Error',
                message: 'Unable to connect to the API. This may be a browser compatibility issue.',
                action: 'retry'
            }
        }

        // Generic error
        return {
            type: 'generic',
            title: '⚠️ Something went wrong',
            message: error && error.message ? error.message : 'An unexpected error occurred.',
            action: 'retry'
        }
    }

    // Enhanced API error handler with better user feedback
    const handleApiError = useCallback((error, fallbackMessage = 'Failed to load data') => {
        const errorInfo = handleError(error, 'API Request')
        
        let toastMessage = fallbackMessage
        let toastOptions = {
            duration: 4000,
            style: {
                background: '#ef4444',
                color: '#white',
                borderRadius: '12px',
            },
            iconTheme: {
                primary: '#white',
                secondary: '#ef4444',
            },
        }

        // Customize message based on error type
        switch (errorInfo.type) {
            case 'network':
                toastMessage = '🌐 Network Issue: Check your internet connection'
                break
            case 'timeout':
                toastMessage = '⏱️ Request Timeout: Server is taking too long to respond'
                break
            case 'auth':
                toastMessage = '🔐 Authentication Error: Invalid API token'
                toastOptions.duration = 6000
                break
            case 'rate_limit':
                toastMessage = '🚦 Rate Limited: Too many requests, please wait'
                toastOptions.duration = 5000
                break
            case 'server':
                toastMessage = '🔧 Server Error: TMDB service is temporarily unavailable'
                break
            case 'not_found':
                toastMessage = '🔍 Content Not Found: This content may no longer be available'
                break
            default:
                toastMessage = `❌ ${fallbackMessage}`
                break
        }

        // Show toast notification
        toast.error(toastMessage, toastOptions)
        
        // Log detailed error for debugging
        console.group('🚨 API Error Details')
        console.error('Error Type:', errorInfo.type)
        console.error('Error Message:', errorInfo.message)
        console.error('Can Retry:', errorInfo.canRetry)
        console.error('Original Error:', error)
        console.error('Response Status:', error?.response?.status)
        console.error('Response Data:', error?.response?.data)
        console.groupEnd()

        return errorInfo
    }, [handleError])

    // Enhanced async error handler with retry logic
    const handleAsyncError = useCallback(async (asyncFn, context = '', showToast = true) => {
        let lastError = null
        const maxRetries = 3
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await asyncFn()
                if (attempt > 1) {
                    console.log(`✅ Retry successful on attempt ${attempt}`)
                    if (showToast) {
                        toast.success('Connection restored! 🎉', {
                            duration: 2000,
                            style: {
                                background: '#10b981',
                                color: 'white',
                                borderRadius: '12px',
                            },
                        })
                    }
                }
                return result
            } catch (error) {
                lastError = error
                const errorInfo = handleError(error, context)
                
                console.warn(`❌ Attempt ${attempt}/${maxRetries} failed:`, errorInfo.message)
                
                // Don't retry if error is not retryable
                if (!errorInfo.canRetry) {
                    console.error('Error is not retryable, stopping attempts')
                    break
                }
                
                // Wait before retrying (exponential backoff)
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
                    console.log(`⏳ Waiting ${delay}ms before retry...`)
                    await new Promise(resolve => setTimeout(resolve, delay))
                }
            }
        }
        
        // All retries failed
        console.error(`🔴 All ${maxRetries} attempts failed for ${context}`)
        if (showToast) {
            handleApiError(lastError, `Failed to ${context} after ${maxRetries} attempts`)
        }
        
        throw lastError
    }, [handleError, handleApiError])

    // Create error toast with custom styling
    const createErrorToast = useCallback((message, type = 'error') => {
        const toastConfig = {
            error: {
                icon: '❌',
                style: {
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '500',
                },
            },
            warning: {
                icon: '⚠️',
                style: {
                    background: '#f59e0b',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '500',
                },
            },
            info: {
                icon: 'ℹ️',
                style: {
                    background: '#3b82f6',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: '500',
                },
            },
        }

        const config = toastConfig[type] || toastConfig.error
        
        toast(message, {
            duration: 4000,
            ...config,
        })
    }, [])

    // Enhanced health check for API connectivity with multiple fallback methods
    const checkApiHealth = async () => {
        try {
            console.log('🏥 Checking TMDB API health with multiple methods...')
            
            // Use the enhanced API configuration test
            const result = await API_CONFIG.testConnection()
            
            if (result.success) {
                console.log(`✅ API health check passed using method ${result.method}`)
                return true
            } else {
                console.warn('⚠️ All API connection methods failed:', result.error)
                
                // Try one more basic method as final fallback
                try {
                    const basicResponse = await axios.get('https://api.themoviedb.org/3/configuration', {
                        timeout: 5000,
                        headers: {
                            'Authorization': `Bearer ${API_CONFIG.ACCESS_TOKEN}`
                        }
                    })
                    
                    if (basicResponse.status === 200) {
                        console.log('✅ Basic API health check passed as fallback')
                        return true
                    }
                } catch (basicError) {
                    console.error('❌ Basic fallback also failed:', basicError.message)
                }
                
                return false
            }
        } catch (error) {
            console.error('❌ API health check error:', error.message || error)
            return false
        }
    }

    return {
        handleError,
        handleApiError,
        handleAsyncError,
        createErrorToast,
        checkApiHealth,
        classifyError
    }
}

export default useErrorHandler 