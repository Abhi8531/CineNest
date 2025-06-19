import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IoSearchOutline, IoClose } from 'react-icons/io5'
import { MdFilterList } from 'react-icons/md'
import Card from '../components/Card'
import LoadingSpinner, { CardSkeleton, PageLoader } from '../components/LoadingSpinner'
import ErrorFallback from '../components/ErrorFallback'
import useErrorHandler from '../hooks/useErrorHandler'
import axios from 'axios'

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useSelector(state => state.cineNest.theme)
  const { handleApiError } = useErrorHandler()

  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState('multi') // multi, movie, tv, person

  const query = location?.search?.slice(3)?.split('%20')?.join(' ') || ''

  const fetchData = useCallback(async (pageNum = 1, isNewSearch = false) => {
    if (!query.trim()) {
      setInitialLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const endpoint = filter === 'multi' ? 'search/multi' : `search/${filter}`
      const response = await axios.get(endpoint, {
        params: {
          query: query,
          page: pageNum
        }
      })

      const newResults = response.data.results || []
      
      if (isNewSearch) {
        setData(newResults)
      } else {
        setData(prev => [...prev, ...newResults])
      }

      setTotalResults(response.data.total_results || 0)
      setHasMore(pageNum < (response.data.total_pages || 1))
      
    } catch (err) {
      console.error('Search error:', err)
      setError(err)
      handleApiError(err, 'Failed to search content')
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [query, filter, handleApiError])

  // Handle search input changes
  const handleSearchInput = (value) => {
    setSearchInput(value)
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchInput('')
    navigate('/search')
    setData([])
    setTotalResults(0)
  }

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (
      !loading && 
      hasMore && 
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000
    ) {
      setPage(prev => prev + 1)
    }
  }, [loading, hasMore])

  // Load more data when page changes
  useEffect(() => {
    if (page > 1) {
      fetchData(page, false)
    }
  }, [page, fetchData])

  // Handle new search
  useEffect(() => {
    setInitialLoading(true)
    if (query) {
      setSearchInput(query)
      setPage(1)
      setData([])
      setHasMore(true)
      fetchData(1, true)
    } else {
      setData([])
      setTotalResults(0)
      setInitialLoading(false)
    }
  }, [query, filter, fetchData])

  // Setup scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setPage(1)
  }

  const retry = () => {
    setError(null)
    setPage(1)
    setInitialLoading(true)
    fetchData(1, true)
  }

  // Show initial loading screen
  if (initialLoading && query) {
    return <PageLoader text="Searching..." />
  }

  return (
    <div className={`min-h-screen pt-16 pb-8 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'}`}>
      <div className='container mx-auto px-4'>
        
        {/* Mobile Search Bar */}
        <div className='lg:hidden mb-6 sticky top-16 z-30 bg-inherit py-4'>
          <div className='relative'>
            <input 
              type='text'
              placeholder='Search movies, TV shows, people...'
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              className={`w-full px-4 py-3 pl-12 pr-12 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-black placeholder-gray-500'
              }`}
            />
            <IoSearchOutline className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            {searchInput && (
              <button
                onClick={clearSearch}
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-xl ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'
                }`}
              >
                <IoClose />
              </button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {query ? `Search Results` : 'Search'}
            </h1>
            {query && (
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {totalResults > 0 ? `Found ${totalResults.toLocaleString()} results for "${query}"` : `No results found for "${query}"`}
              </p>
            )}
          </div>

          {/* Filter Buttons */}
          {query && (
            <div className='flex items-center gap-2'>
              <MdFilterList className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              <div className='flex rounded-lg overflow-hidden border border-gray-600'>
                {[
                  { key: 'multi', label: 'All' },
                  { key: 'movie', label: 'Movies' },
                  { key: 'tv', label: 'TV Shows' },
                  { key: 'person', label: 'People' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.key}
                    onClick={() => handleFilterChange(filterOption.key)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      filter === filterOption.key
                        ? 'bg-purple-500 text-white'
                        : theme === 'dark' 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {error ? (
          <ErrorFallback 
            error={error} 
            onRetry={retry}
            title="Search Failed"
            message="Failed to search content. Please try again."
          />
        ) : !query ? (
          // Empty state
          <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <IoSearchOutline className="mx-auto text-6xl mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Start Searching</h3>
            <p>Enter a movie, TV show, or person name to begin your search</p>
          </div>
        ) : data.length === 0 && !loading ? (
          // No results
          <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <IoSearchOutline className="mx-auto text-6xl mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
            <p>Try adjusting your search terms or filters</p>
            <button
              onClick={clearSearch}
              className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          // Results grid
          <>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
              {data.map((item, index) => (
                <Card 
                  key={`${item.id}-${filter}-${index}`}
                  data={item} 
                  media_type={item.media_type || filter}
                />
              ))}
            </div>

            {/* Loading more */}
            {loading && (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4'>
                {Array.from({ length: 12 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            )}

            {/* Load more indicator */}
            {hasMore && !loading && data.length > 0 && (
              <div className='text-center py-8'>
                <LoadingSpinner size="md" text="Scroll for more results..." />
              </div>
            )}

            {/* End of results */}
            {!hasMore && data.length > 0 && (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>You've reached the end of the results</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchPage
