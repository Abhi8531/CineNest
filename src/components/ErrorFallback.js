import React from 'react'
import { useSelector } from 'react-redux'
import { MdRefresh, MdErrorOutline } from 'react-icons/md'
import { BiSad } from 'react-icons/bi'

const ErrorFallback = ({ 
    error, 
    onRetry, 
    title = "Failed to Load", 
    message = "Something went wrong while loading this content.",
    showRetry = true,
    compact = false 
}) => {
    const theme = useSelector(state => state.cineNest?.theme || 'dark')

    if (compact) {
        return (
            <div className={`flex items-center justify-center p-6 rounded-lg border-2 border-dashed ${
                theme === 'dark' 
                    ? 'border-gray-700 bg-gray-800/50' 
                    : 'border-gray-300 bg-gray-50'
            }`}>
                <div className="text-center">
                    <MdErrorOutline className={`mx-auto text-3xl mb-2 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        {message}
                    </p>
                    {showRetry && onRetry && (
                        <button
                            onClick={onRetry}
                            className={`mt-2 text-xs px-3 py-1 rounded transition-colors ${
                                theme === 'dark' 
                                    ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10' 
                                    : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                            }`}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-center justify-center p-12 ${
            theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'
        }`}>
            <div className="text-center max-w-md">
                {/* Error Icon */}
                <div className="mb-6">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                        theme === 'dark' 
                            ? 'bg-red-500/10 border border-red-500/20' 
                            : 'bg-red-50 border border-red-200'
                    }`}>
                        <BiSad className={`text-2xl ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-500'
                        }`} />
                    </div>
                </div>

                {/* Error Content */}
                <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    {title}
                </h3>
                
                <p className={`mb-6 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    {message}
                </p>

                {/* Error Details */}
                {error && process.env.NODE_ENV === 'development' && (
                    <div className={`mb-6 p-3 rounded-lg text-left text-xs ${
                        theme === 'dark' 
                            ? 'bg-gray-800 border border-gray-700 text-gray-400' 
                            : 'bg-gray-100 border border-gray-200 text-gray-600'
                    }`}>
                        <strong>Debug Info:</strong><br />
                        {error.message || error.toString()}
                    </div>
                )}

                {/* Retry Button */}
                {showRetry && onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <MdRefresh size={16} />
                        Try Again
                    </button>
                )}
            </div>
        </div>
    )
}

// Section-specific error fallbacks
export const SectionErrorFallback = ({ error, onRetry, sectionName = "section" }) => {
    return (
        <ErrorFallback
            error={error}
            onRetry={onRetry}
            title={`Failed to Load ${sectionName}`}
            message={`We couldn't load the ${sectionName.toLowerCase()} content. Please try again.`}
            compact={true}
        />
    )
}

export const CardErrorFallback = ({ onRetry }) => {
    const theme = useSelector(state => state.cineNest?.theme || 'dark')
    
    return (
        <div className={`w-full min-w-[230px] max-w-[230px] h-80 rounded-xl flex items-center justify-center border-2 border-dashed ${
            theme === 'dark' 
                ? 'border-gray-700 bg-gray-800/50' 
                : 'border-gray-300 bg-gray-50'
        }`}>
            <div className="text-center p-4">
                <MdErrorOutline className={`mx-auto text-2xl mb-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <p className={`text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    Failed to load
                </p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                            theme === 'dark' 
                                ? 'text-purple-400 hover:text-purple-300' 
                                : 'text-purple-600 hover:text-purple-700'
                        }`}
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    )
}

export default ErrorFallback 