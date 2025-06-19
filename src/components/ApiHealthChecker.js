import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useErrorHandler from '../hooks/useErrorHandler'

const ApiHealthChecker = ({ onHealthCheck }) => {
    const theme = useSelector(state => state.cineNest?.theme || 'dark')
    const { checkApiHealth } = useErrorHandler()
    
    const [isChecking, setIsChecking] = useState(false)
    const [healthStatus, setHealthStatus] = useState(null)
    const [lastCheck, setLastCheck] = useState(null)

    const performHealthCheck = async () => {
        setIsChecking(true)
        try {
            const isHealthy = await checkApiHealth()
            setHealthStatus(isHealthy)
            setLastCheck(new Date())
            
            if (onHealthCheck) {
                onHealthCheck(isHealthy)
            }
        } catch (error) {
            setHealthStatus(false)
            setLastCheck(new Date())
        } finally {
            setIsChecking(false)
        }
    }

    useEffect(() => {
        // Check API health on component mount
        performHealthCheck()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isChecking && !lastCheck) {
        return (
            <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                    ? 'bg-blue-900/20 border-blue-700 text-blue-300' 
                    : 'bg-blue-100 border-blue-300 text-blue-700'
            }`}>
                <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm">Checking TMDB API status...</span>
                </div>
            </div>
        )
    }

    if (healthStatus === false) {
        return (
            <div className={`p-4 rounded-lg border ${
                theme === 'dark' 
                    ? 'bg-red-900/20 border-red-700 text-red-300' 
                    : 'bg-red-100 border-red-300 text-red-700'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-red-500">❌</span>
                        <div>
                            <p className="font-medium">API Connection Failed</p>
                            <p className="text-xs opacity-75">
                                Last checked: {lastCheck?.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={performHealthCheck}
                        disabled={isChecking}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                        {isChecking ? 'Checking...' : 'Retry'}
                    </button>
                </div>
            </div>
        )
    }

    if (healthStatus === true) {
        return (
            <div className={`p-3 rounded-lg border ${
                theme === 'dark' 
                    ? 'bg-green-900/20 border-green-700 text-green-300' 
                    : 'bg-green-100 border-green-300 text-green-700'
            }`}>
                <div className="flex items-center gap-2">
                    <span className="text-green-500">✅</span>
                    <div>
                        <p className="text-sm font-medium">TMDB API Connected</p>
                        <p className="text-xs opacity-75">
                            Last checked: {lastCheck?.toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default ApiHealthChecker 