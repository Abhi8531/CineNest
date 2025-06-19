import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useRouteError } from 'react-router-dom'
import { MdRefresh, MdHome, MdBugReport } from 'react-icons/md'
import { BiSad } from 'react-icons/bi'

// Router Error Component
export const RouterErrorBoundary = () => {
    const error = useRouteError()
    const theme = useSelector(state => state.cineNest?.theme || 'dark')

    const handleRefresh = () => {
        window.location.reload()
    }

    const handleReportError = () => {
        // You can implement error reporting here
        console.error('Error reported:', error)
        // Example: send to error tracking service
        // analytics.track('error_reported', { error: error.message })
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
            theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'
        }`}>
            <div className={`max-w-md w-full text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
                {/* Error Icon */}
                <div className="mb-8">
                    <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
                        theme === 'dark' 
                            ? 'bg-red-500/10 border border-red-500/20' 
                            : 'bg-red-50 border border-red-200'
                    }`}>
                        <BiSad className={`text-4xl ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-500'
                        }`} />
                    </div>
                </div>

                {/* Error Message */}
                <h1 className={`text-3xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    Oops! Something went wrong
                </h1>
                
                <p className={`text-lg mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    We're sorry, but something unexpected happened.
                </p>

                {/* Error Details */}
                {error && (
                    <div className={`mb-6 p-4 rounded-lg text-left ${
                        theme === 'dark' 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-gray-100 border border-gray-200'
                    }`}>
                        <h3 className={`font-semibold mb-2 text-sm ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}>
                            Error Details:
                        </h3>
                        <p className={`text-sm font-mono ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {error.message || error.statusText || 'Unknown error occurred'}
                        </p>
                        {error.status && (
                            <p className={`text-xs mt-1 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                                Status: {error.status}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleRefresh}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <MdRefresh size={20} />
                        Try Again
                    </button>

                    <Link
                        to="/"
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition-all duration-200 ${
                            theme === 'dark' 
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <MdHome size={20} />
                        Go Home
                    </Link>

                    <button
                        onClick={handleReportError}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm transition-colors ${
                            theme === 'dark' 
                                ? 'text-gray-400 hover:text-gray-300' 
                                : 'text-gray-600 hover:text-gray-700'
                        }`}
                    >
                        <MdBugReport size={16} />
                        Report This Error
                    </button>
                </div>

                {/* CineNest Branding */}
                <div className="mt-8 pt-6 border-t border-gray-600">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                            <span className="text-white text-sm">🎬</span>
                        </div>
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

// Class-based Error Boundary for catching JavaScript errors
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        
        // Log error to console for development
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        
        // You can also log the error to an error reporting service here
        // Example: reportError(error, errorInfo)
    }

    handleRefresh = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            const theme = 'dark' // Default to dark theme if store is not accessible
            
            return (
                <div className={`min-h-screen flex items-center justify-center p-4 ${
                    theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'
                }`}>
                    <div className={`max-w-md w-full text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {/* Error Icon */}
                        <div className="mb-8">
                            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center ${
                                theme === 'dark' 
                                    ? 'bg-red-500/10 border border-red-500/20' 
                                    : 'bg-red-50 border border-red-200'
                            }`}>
                                <BiSad className={`text-4xl ${
                                    theme === 'dark' ? 'text-red-400' : 'text-red-500'
                                }`} />
                            </div>
                        </div>

                        {/* Error Message */}
                        <h1 className={`text-3xl font-bold mb-4 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Something went wrong
                        </h1>
                        
                        <p className={`text-lg mb-6 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            We're sorry for the inconvenience. Please try refreshing the page.
                        </p>

                        {/* Error Details (only in development) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className={`mb-6 p-4 rounded-lg text-left ${
                                theme === 'dark' 
                                    ? 'bg-gray-800 border border-gray-700' 
                                    : 'bg-gray-100 border border-gray-200'
                            }`}>
                                <h3 className={`font-semibold mb-2 text-sm ${
                                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                }`}>
                                    Error Details (Development):
                                </h3>
                                <p className={`text-xs font-mono ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo.componentStack && (
                                    <details className="mt-2">
                                        <summary className={`cursor-pointer text-xs ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                            Component Stack
                                        </summary>
                                        <pre className={`text-xs mt-1 whitespace-pre-wrap ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={this.handleRefresh}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                <MdRefresh size={20} />
                                Refresh Page
                            </button>

                            <a
                                href="/"
                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border transition-all duration-200 ${
                                    theme === 'dark' 
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <MdHome size={20} />
                                Go Home
                            </a>
                        </div>

                        {/* CineNest Branding */}
                        <div className="mt-8 pt-6 border-t border-gray-600">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                                    <span className="text-white text-sm">🎬</span>
                                </div>
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

        return this.props.children
    }
}

export default ErrorBoundary 