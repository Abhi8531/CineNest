import { useCallback } from 'react'
import toast from 'react-hot-toast'

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

    // Check API health
    const checkApiHealth = useCallback(async () => {
        try {
            const response = await fetch('https://api.themoviedb.org/3/configuration', {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
                },
            })
            
            if (!response.ok) {
                throw new Error(`API Health Check Failed: ${response.status} ${response.statusText}`)
            }
            
            console.log('✅ TMDB API is healthy')
            return true
        } catch (error) {
            console.error('🔴 TMDB API health check failed:', error)
            createErrorToast('TMDB API is currently unavailable', 'error')
            return false
        }
    }, [createErrorToast])

    return {
        handleError,
        handleApiError,
        handleAsyncError,
        createErrorToast,
        checkApiHealth
    }
}

export default useErrorHandler 