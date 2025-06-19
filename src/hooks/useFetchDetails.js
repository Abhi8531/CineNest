import axios from "axios"
import { useEffect, useState } from "react"
import useErrorHandler from "./useErrorHandler"

const useFetchDetails = (endpoint, options = {}) => {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    
    const { handleApiError } = useErrorHandler()
    const maxRetries = options.maxRetries || 3
    const showToast = options.showToast !== false
    const retryDelay = options.retryDelay || 1000

    const fetchData = async (isRetry = false) => {
        try {
            if (!isRetry) {
                setLoading(true)
                setError(null)
            }
            
            const response = await axios.get(endpoint)
            setData(response.data)
            setError(null)
            setRetryCount(0)
        } catch (err) {
            console.error(`Error fetching ${endpoint}:`, err)
            setError(err)
            
            // Only show toast for non-retry attempts or final failure
            if (!isRetry || retryCount >= maxRetries) {
                if (showToast) {
                    handleApiError(err, `Failed to load details from ${endpoint}`)
                }
            }
            
            // Retry logic for network errors or 5xx errors
            if (retryCount < maxRetries && 
                (err.code === 'NETWORK_ERROR' || 
                 (err.response && err.response.status >= 500))) {
                
                setTimeout(() => {
                    setRetryCount(prev => prev + 1)
                    fetchData(true)
                }, retryDelay * (retryCount + 1)) // Exponential backoff
            }
            
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const retry = () => {
        setRetryCount(0)
        fetchData()
    }

    useEffect(() => {
        if (endpoint) {
            fetchData()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint])

    return { 
        data, 
        loading, 
        error,
        retry,
        isRetrying: retryCount > 0
    }
}

export default useFetchDetails