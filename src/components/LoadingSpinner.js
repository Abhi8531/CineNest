import React from 'react'
import { useSelector } from 'react-redux'

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
    const theme = useSelector(state => state.cineNest?.theme || 'dark')

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    }

    const spinnerContent = (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* CineNest Logo Spinner */}
            <div className={`relative ${sizeClasses[size]}`}>
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🎬</span>
                </div>
            </div>

            {/* Loading Text */}
            {text && (
                <div className="text-center">
                    <p className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        {text}
                    </p>
                    <div className="flex items-center justify-center mt-2 space-x-1">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                            theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                        }`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                            theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                        }`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                            theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'
                        }`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className={`fixed inset-0 flex items-center justify-center z-50 ${
                theme === 'dark' ? 'bg-neutral-900/80' : 'bg-gray-50/80'
            } backdrop-blur-sm`}>
                {spinnerContent}
            </div>
        )
    }

    return spinnerContent
}

// Page Loading Component
export const PageLoader = ({ text = 'Loading page...' }) => {
    const theme = useSelector(state => state.cineNest?.theme || 'dark')

    return (
        <div className={`min-h-screen flex items-center justify-center ${
            theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'
        }`}>
            <div className="text-center">
                <LoadingSpinner size="xl" text={text} />
                
                {/* CineNest Branding */}
                <div className="mt-8 pt-6 border-t border-gray-600">
                    <div className="flex items-center justify-center gap-2">
                        <span className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            CineNest - Your Cinema Discovery Platform
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Skeleton Loading Component for Cards
export const CardSkeleton = () => {
    const theme = useSelector(state => state.cineNest?.theme || 'dark')

    return (
        <div className={`w-full min-w-[230px] max-w-[230px] h-80 rounded-xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
            <div className={`w-full h-full animate-pulse ${
                theme === 'dark' ? 'shimmer-dark' : 'shimmer'
            }`}></div>
        </div>
    )
}

// Section Loading Component
export const SectionLoader = ({ count = 6 }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-4 overflow-x-auto scrolbar-none">
                {Array.from({ length: count }).map((_, index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}

export default LoadingSpinner 