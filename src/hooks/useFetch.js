import axios from "axios"
import { useEffect, useState } from "react"
import useErrorHandler from "./useErrorHandler"

const useFetch = (endpoint, options = {}) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    
    const { checkApiHealth } = useErrorHandler()
    const maxRetries = options.maxRetries || 3
    const showToast = options.showToast !== false
    const retryDelay = options.retryDelay || 1000

    const fetchData = async (isRetry = false, attempt = 0) => {
        // Don't show loading for retries to prevent UI flashing
        if (!isRetry || attempt === 0) {
            setLoading(true)
            setError(null)
        }
        
        try {
            console.log(`🚀 Fetching data from: ${endpoint} (attempt ${attempt + 1})`)
            
            // Create axios request with enhanced configuration
            const requestConfig = {
                timeout: 15000, // 15 second timeout
                headers: {
                    'Content-Type': 'application/json',
                },
                params: options.params || {},
            }
            
            console.log(`📝 Request config:`, requestConfig)
            
            const response = await axios.get(endpoint, requestConfig)
            
            console.log(`✅ Data fetched successfully:`, response.data)
            
            // Handle different response structures
            const resultData = response.data.results || response.data || []
            setData(Array.isArray(resultData) ? resultData : [resultData])
            setError(null)
            setRetryCount(0)
            
            // Success toast for retries
            if (attempt > 0 && showToast) {
                console.log(`🎉 Retry successful after ${attempt} attempts`)
            }
            
        } catch (err) {
            console.error(`❌ Fetch error (attempt ${attempt + 1}/${maxRetries}):`, err)
            
            // Enhanced error classification with safe property access
            const isNetworkError = err.code === 'NETWORK_ERROR' || 
                                 err.code === 'ECONNABORTED' || 
                                 (err.message && err.message.includes('Network Error')) ||
                                 (err.message && err.message.includes('timeout'))
            
            const isServerError = err.response && err.response.status >= 500
            const isRetryableError = isNetworkError || isServerError
            
            // Retry logic with exponential backoff
            if (isRetryableError && attempt < maxRetries) {
                const delay = Math.min(retryDelay * Math.pow(2, attempt), 10000) // Max 10 seconds
                console.log(`⏳ Retrying in ${delay}ms... (${attempt + 1}/${maxRetries})`)
                
                setRetryCount(attempt + 1)
                
                setTimeout(() => {
                    fetchData(true, attempt + 1)
                }, delay)
                return
            }
            
            // Max retries reached or non-retryable error
            console.error(`🔴 Max retries reached or non-retryable error`)
            setError(err)
            setData([])
            setRetryCount(0)
            
            // Only show toast for final failure if not disabled
            if (showToast && (attempt >= maxRetries || !isRetryableError)) {
                // The error handler will show appropriate toast
                console.error('Final error being set:', err.message || err)
            }
            
        } finally {
            setLoading(false)
        }
    }

    const retry = async () => {
        console.log('🔄 Manual retry triggered')
        setRetryCount(0)
        setError(null)
        
        // Check API health before retrying
        const isHealthy = await checkApiHealth()
        if (!isHealthy) {
            console.warn('⚠️ API health check failed, retrying anyway...')
        }
        
        await fetchData(false, 0)
    }

    useEffect(() => {
        if (endpoint) {
            console.log('🎬 useFetch: Starting fetch for', endpoint)
            fetchData(false, 0)
        } else {
            console.warn('⚠️ useFetch: No endpoint provided')
            setLoading(false)
            setData([])
        }
        
        // Cleanup function
        return () => {
            console.log('🧹 useFetch: Cleaning up for', endpoint)
            setLoading(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint])

    // Debug logging
    useEffect(() => {
        console.log(`📊 useFetch state for ${endpoint}:`, {
            dataLength: data.length,
            loading,
            error: error && error.message ? error.message : null,
            retryCount
        })
    }, [endpoint, data, loading, error, retryCount])

    return { 
        data, 
        loading, 
        error,
        retry,
        isRetrying: retryCount > 0,
        retryCount
    }
}

export default useFetch