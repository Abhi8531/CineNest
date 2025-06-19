import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdSort } from 'react-icons/md'
import { FiGrid, FiList } from 'react-icons/fi'
import Card from '../components/Card'
import LoadingSpinner, { CardSkeleton, PageLoader } from '../components/LoadingSpinner'
import ErrorFallback from '../components/ErrorFallback'
import useErrorHandler from '../hooks/useErrorHandler'
import useFetch from '../hooks/useFetch'
import axios from 'axios'

const ExplorePage = () => {
  const params = useParams()
  const location = useLocation()
  const theme = useSelector(state => state.cineNest.theme)
  const { handleApiError } = useErrorHandler()

  const [pageNo, setPageNo] = useState(1)
  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [viewMode, setViewMode] = useState('grid')
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')

  // Determine the type of exploration based on the current path
  const currentPath = location.pathname.replace('/', '')
  const exploreType = params.explore || currentPath
  
  // Map route to media type and endpoint with better error handling
  const config = useMemo(() => {
    console.log('Explore Type:', exploreType) // Debug log
    
    switch (exploreType) {
      case 'movie':
        return { 
          mediaType: 'movie', 
          endpoint: '/discover/movie', 
          title: 'Movies',
          useDiscoverParams: true
        }
      case 'tv':
        return { 
          mediaType: 'tv', 
          endpoint: '/discover/tv', 
          title: 'TV Shows',
          useDiscoverParams: true
        }
      case 'trending':
        return { 
          mediaType: 'multi', 
          endpoint: '/trending/all/week', 
          title: 'Trending',
          useDiscoverParams: false
        }
      case 'top-rated':
        return { 
          mediaType: 'movie', 
          endpoint: '/movie/top_rated', 
          title: 'Top Rated Movies',
          useDiscoverParams: false
        }
      case 'coming-soon':
        return { 
          mediaType: 'movie', 
          endpoint: '/movie/upcoming', 
          title: 'Coming Soon',
          useDiscoverParams: false
        }
      case 'awards':
        return { 
          mediaType: 'movie', 
          endpoint: '/discover/movie', 
          title: 'Award Winners',
          useDiscoverParams: true,
          extraParams: { 'vote_average.gte': 8, 'vote_count.gte': 1000 }
        }
      default:
        // Fallback for unknown routes
        return { 
          mediaType: 'movie', 
          endpoint: '/discover/movie', 
          title: 'Movies',
          useDiscoverParams: true
        }
    }
  }, [exploreType])

  const { mediaType, endpoint, title, useDiscoverParams, extraParams = {} } = config

  // Use the enhanced useFetch hook for initial data
  const { 
    data: initialData, 
    retry: retryFetch 
  } = useFetch(endpoint, { 
    showToast: false,
    maxRetries: 3 
  })

  // Sort options based on media type
  const getSortOptions = () => {
    const baseOptions = [
      { value: 'popularity.desc', label: 'Most Popular' },
      { value: 'popularity.asc', label: 'Least Popular' },
      { value: 'vote_average.desc', label: 'Highest Rated' },
      { value: 'vote_average.asc', label: 'Lowest Rated' },
    ]

    if (mediaType === 'movie') {
      return [
        ...baseOptions,
        { value: 'release_date.desc', label: 'Newest First' },
        { value: 'release_date.asc', label: 'Oldest First' },
        { value: 'original_title.asc', label: 'A-Z' },
        { value: 'original_title.desc', label: 'Z-A' }
      ]
    } else if (mediaType === 'tv') {
      return [
        ...baseOptions,
        { value: 'first_air_date.desc', label: 'Newest First' },
        { value: 'first_air_date.asc', label: 'Oldest First' },
        { value: 'original_name.asc', label: 'A-Z' },
        { value: 'original_name.desc', label: 'Z-A' }
      ]
    }
    return baseOptions
  }

  // Fetch genres with retry logic
  const fetchGenres = useCallback(async () => {
    if (mediaType === 'multi' || exploreType === 'trending') return
    
    let retryCount = 0
    const maxRetries = 3
    
    const attemptFetch = async () => {
      try {
        console.log(`Fetching genres for ${mediaType}...`) // Debug log
        const response = await axios.get(`/genre/${mediaType}/list`)
        setGenres(response.data.genres || [])
        console.log(`Genres loaded:`, response.data.genres?.length || 0) // Debug log
      } catch (err) {
        console.error(`Failed to fetch genres (attempt ${retryCount + 1}):`, err)
        
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(attemptFetch, 1000 * retryCount) // Exponential backoff
        } else {
          console.error('Max retries reached for genres')
          setGenres([]) // Set empty array as fallback
        }
      }
    }
    
    attemptFetch()
  }, [mediaType, exploreType])

  // Enhanced fetch data with robust error handling
  const fetchData = useCallback(async (pageNum = 1, isNewSearch = false, retryAttempt = 0) => {
    const maxRetries = 3
    
    try {
      if (!isNewSearch && pageNum === 1) {
        setInitialLoading(true)
      }
      setLoading(true)
      setError(null)

      console.log(`Fetching data: ${endpoint}, page: ${pageNum}`) // Debug log

      let requestConfig = { 
        params: { page: pageNum },
        timeout: 10000 // 10 second timeout
      }
      
      // Configure request based on explore type
      if (useDiscoverParams) {
        requestConfig.params = {
          ...requestConfig.params,
          sort_by: sortBy,
          include_adult: false,
          include_video: false,
          language: 'en-US',
          ...extraParams
        }

        if (selectedGenre) {
          requestConfig.params.with_genres = selectedGenre
        }
      }

      console.log('Request config:', requestConfig) // Debug log

      const response = await axios.get(endpoint, requestConfig)
      
      console.log('API Response received:', response.data) // Debug log

      const newResults = response.data.results || []
      
      if (isNewSearch || pageNum === 1) {
        setAllData(newResults)
      } else {
        setAllData(prev => [...prev, ...newResults])
      }

      setTotalPages(response.data.total_pages || 0)
      setTotalResults(response.data.total_results || 0)
      setHasMore(pageNum < (response.data.total_pages || 1))
      
      console.log(`Loaded ${newResults.length} items, total: ${response.data.total_results}`) // Debug log
      
    } catch (err) {
      console.error(`Explore error (attempt ${retryAttempt + 1}):`, err)
      
      // Retry logic for network errors
      if (retryAttempt < maxRetries && 
          (err.code === 'NETWORK_ERROR' || 
           err.code === 'ECONNABORTED' ||
           (err.response && err.response.status >= 500))) {
        
        console.log(`Retrying in ${(retryAttempt + 1) * 1000}ms...`)
        setTimeout(() => {
          fetchData(pageNum, isNewSearch, retryAttempt + 1)
        }, (retryAttempt + 1) * 1000)
        return
      }
      
      setError(err)
      handleApiError(err, `Failed to load ${title}`)
      setAllData([])
      
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [endpoint, sortBy, selectedGenre, title, extraParams, handleApiError, useDiscoverParams])

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (
      !loading && 
      hasMore && 
      allData.length > 0 && // Only scroll if we have data
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000
    ) {
      console.log('Loading more data...') // Debug log
      setPageNo(prev => prev + 1)
    }
  }, [loading, hasMore, allData.length])

  // Load more data when page changes
  useEffect(() => {
    if (pageNo > 1) {
      fetchData(pageNo, false)
    }
  }, [pageNo, fetchData])

  // Handle new search when filters change
  useEffect(() => {
    console.log('Filters changed, resetting...') // Debug log
    setInitialLoading(true)
    setPageNo(1)
    setAllData([])
    setHasMore(true)
    setError(null)
    
    // Use a small delay to prevent rapid API calls
    const timer = setTimeout(() => {
      fetchData(1, true)
    }, 100)
    
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exploreType, sortBy, selectedGenre])

  // Setup scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Fetch genres when media type changes
  useEffect(() => {
    fetchGenres()
  }, [fetchGenres])

  // Reset filters when explore type changes
  useEffect(() => {
    console.log('Explore type changed, resetting filters...') // Debug log
    setSortBy('popularity.desc')
    setSelectedGenre('')
    setPageNo(1)
  }, [exploreType])

  // If using useFetch and it has initial data, use it
  useEffect(() => {
    if (initialData && initialData.length > 0 && allData.length === 0) {
      console.log('Using initial fetch data:', initialData.length) // Debug log
      setAllData(initialData)
      setInitialLoading(false)
      setTotalResults(initialData.length)
      setHasMore(true)
    }
  }, [initialData, allData.length])

  // Enhanced retry function
  const retry = () => {
    console.log('Manual retry triggered') // Debug log
    setError(null)
    setPageNo(1)
    setAllData([])
    setInitialLoading(true)
    setHasMore(true)
    
    // Try both useFetch retry and manual fetch
    if (retryFetch) {
      retryFetch()
    }
    fetchData(1, true)
  }

  const handleSortChange = (newSort) => {
    console.log('Sort changed to:', newSort) // Debug log
    setSortBy(newSort)
    setPageNo(1)
  }

  const handleGenreChange = (genreId) => {
    console.log('Genre changed to:', genreId) // Debug log
    setSelectedGenre(genreId)
    setPageNo(1)
  }

  // Show initial loading screen
  if (initialLoading) {
    console.log('Showing initial loading screen') // Debug log
    return <PageLoader text={`Loading ${title}...`} />
  }

  // Show error screen with retry option
  if (error && allData.length === 0) {
    console.log('Showing error screen:', error.message) // Debug log
    return (
      <div className={`min-h-screen pt-16 pb-8 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <ErrorFallback 
            error={error} 
            onRetry={retry}
            title={`Failed to Load ${title}`}
            message="There was a problem loading the content. Please check your internet connection and try again."
          />
        </div>
      </div>
    )
  }

  console.log('Rendering main content with', allData.length, 'items') // Debug log

  return (
    <div className={`min-h-screen pt-16 pb-8 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <div className='container mx-auto px-4'>
        
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8'>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
            {totalResults > 0 && (
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {totalResults.toLocaleString()} results found
              </p>
            )}
            {allData.length > 0 && (
              <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                Showing {allData.length} items
              </p>
            )}
          </div>

          {/* Controls */}
          <div className='flex flex-wrap items-center gap-4'>
            
            {/* Genre Filter - only show for movie/tv discovery */}
            {genres.length > 0 && useDiscoverParams && (
              <select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-black'
                }`}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            )}

            {/* Sort - only show for discovery endpoints */}
            {useDiscoverParams && (
              <div className='flex items-center gap-2'>
                <MdSort className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`px-3 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-black'
                  }`}
                >
                  {getSortOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* View Mode */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                    : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <FiGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
                    : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <FiList size={20} />
              </button>
            </div>

            {/* Manual Retry Button */}
            {error && (
              <button
                onClick={retry}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Retry
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {allData.length === 0 && loading ? (
          // Initial loading
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
            {Array.from({ length: 20 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : allData.length === 0 ? (
          // No results
          <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2">No {title} Found</h3>
            <p className="mb-4">Unable to load content. This might be due to:</p>
            <ul className="text-sm mb-6 space-y-1">
              <li>• Network connectivity issues</li>
              <li>• API rate limiting</li>
              <li>• Server temporarily unavailable</li>
            </ul>
            <button
              onClick={retry}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          // Results
          <>
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {allData.map((item, index) => (
                <Card 
                  key={`${item.id}-${index}-${exploreType}`}
                  data={item} 
                  media_type={item.media_type || mediaType}
                />
              ))}
            </div>

            {/* Loading more */}
            {loading && allData.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4'>
                {Array.from({ length: 12 }).map((_, index) => (
                  <CardSkeleton key={`loading-${index}`} />
                ))}
              </div>
            )}

            {/* Load more indicator */}
            {hasMore && !loading && allData.length > 0 && (
              <div className='text-center py-8'>
                <LoadingSpinner size="md" text="Scroll for more..." />
              </div>
            )}

            {/* End of results */}
            {!hasMore && allData.length > 0 && (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>You've seen all available {title.toLowerCase()}</p>
                <p className="text-sm mt-1">Total: {totalResults.toLocaleString()} items</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ExplorePage
