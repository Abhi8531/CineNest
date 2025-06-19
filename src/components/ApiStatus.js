import React from 'react'
import { useSelector } from 'react-redux'
import API_CONFIG from '../config/api'

const ApiStatus = () => {
    const theme = useSelector(state => state.cineNest?.theme || 'dark')
    
    const isConfigured = API_CONFIG.isConfigured()
    const tokenPreview = API_CONFIG.ACCESS_TOKEN ? 
        `${API_CONFIG.ACCESS_TOKEN.substring(0, 20)}...${API_CONFIG.ACCESS_TOKEN.substring(API_CONFIG.ACCESS_TOKEN.length - 10)}` : 
        'Not configured'

    return (
        <div className={`fixed bottom-4 right-4 p-3 rounded-lg border z-50 text-xs max-w-xs ${
            isConfigured 
                ? theme === 'dark' 
                    ? 'bg-green-900/20 border-green-700 text-green-300' 
                    : 'bg-green-100 border-green-300 text-green-700'
                : theme === 'dark' 
                    ? 'bg-red-900/20 border-red-700 text-red-300' 
                    : 'bg-red-100 border-red-300 text-red-700'
        }`}>
            <div className="font-semibold mb-1">
                API Status: {isConfigured ? '✅ Connected' : '❌ Not Configured'}
            </div>
            <div className="opacity-75">
                Token: {tokenPreview}
            </div>
            <div className="opacity-75">
                Environment: {process.env.NODE_ENV}
            </div>
        </div>
    )
}

export default ApiStatus 