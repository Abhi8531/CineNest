import React, { useEffect, useState } from 'react'
import BannerHome from '../components/BannerHome'
import { useSelector } from 'react-redux'

import HorizontalScollCard from '../components/HorizontalScollCard'
import LoadingSpinner, { SectionLoader } from '../components/LoadingSpinner'
import { SectionErrorFallback } from '../components/ErrorFallback'
import useFetch from '../hooks/useFetch'

const Home = () => {
  const trendingData = useSelector(state => state.cineNest.bannerData)
  const theme = useSelector(state => state.cineNest.theme)
  const watchlist = useSelector(state => state.cineNest.watchlist)
  const collections = useSelector(state => state.cineNest.collections)
  
  // Fetch data with loading and error states
  const { data: nowPlayingData, loading: nowPlayingLoading, error: nowPlayingError, retry: retryNowPlaying } = useFetch('/movie/now_playing')
  const { data: topRatedData, loading: topRatedLoading, error: topRatedError, retry: retryTopRated } = useFetch('/movie/top_rated')
  const { data: popularTvShowData, loading: popularTvLoading, error: popularTvError, retry: retryPopularTv } = useFetch('/tv/popular')
  const { data: onTheAirShowData, loading: onTheAirLoading, error: onTheAirError, retry: retryOnTheAir } = useFetch('/tv/on_the_air')
  const { data: upcomingMovies, loading: upcomingLoading, error: upcomingError, retry: retryUpcoming } = useFetch('/movie/upcoming')
  const { data: airingTodayTv, loading: airingTodayLoading, error: airingTodayError, retry: retryAiringToday } = useFetch('/tv/airing_today')
  
  const [isPageLoading, setIsPageLoading] = useState(true)

  // Check if initial critical data is loaded
  useEffect(() => {
    // Page is considered loaded when banner data and at least some content is available
    if (trendingData.length > 0 || (!nowPlayingLoading && !popularTvLoading)) {
      setIsPageLoading(false)
    }
  }, [trendingData, nowPlayingLoading, popularTvLoading])

  // If page is still loading initially, show full page loader
  if (isPageLoading && trendingData.length === 0) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="xl" text="Loading CineNest..." />
        </div>
      </div>
    )
  }
  
  return (
    <div className={`${theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'} min-h-screen`}>
      {/* Hero Banner */}
        <BannerHome/>
      
      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-8">
        <div className={`rounded-2xl p-6 mb-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-gray-800' 
            : 'bg-gradient-to-r from-purple-100 to-pink-100 border border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to CineNest 🎬
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Your personal cinema discovery platform. Explore trending content, build your watchlist, and discover your next favorite movie or show.
          </p>
          {watchlist.length > 0 && (
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
              You have {watchlist.length} items in your watchlist
            </p>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Trending Section */}
        {trendingData.length > 0 ? (
          <HorizontalScollCard 
            data={trendingData} 
            heading={"🔥 Trending Now"} 
            trending={true}
          />
        ) : (
          <SectionLoader count={6} />
        )}

        {/* Now Playing Movies */}
        {nowPlayingError ? (
          <SectionErrorFallback 
            error={nowPlayingError} 
            onRetry={retryNowPlaying} 
            sectionName="Now Playing Movies" 
          />
        ) : (
          <HorizontalScollCard 
            data={nowPlayingData} 
            heading={"🎬 Now Playing in Theaters"} 
            media_type={"movie"}
            loading={nowPlayingLoading}
          />
        )}

        {/* Popular TV Shows */}
        {popularTvError ? (
          <SectionErrorFallback 
            error={popularTvError} 
            onRetry={retryPopularTv} 
            sectionName="Popular TV Shows" 
          />
        ) : (
          <HorizontalScollCard 
            data={popularTvShowData} 
            heading={"📺 Popular TV Shows"} 
            media_type={"tv"}
            loading={popularTvLoading}
          />
        )}

        {/* Upcoming Movies */}
        {upcomingError ? (
          <SectionErrorFallback 
            error={upcomingError} 
            onRetry={retryUpcoming} 
            sectionName="Coming Soon" 
          />
        ) : (
          <HorizontalScollCard 
            data={upcomingMovies} 
            heading={"🚀 Coming Soon"} 
            media_type={"movie"}
            loading={upcomingLoading}
          />
        )}

        {/* Top Rated Movies */}
        {topRatedError ? (
          <SectionErrorFallback 
            error={topRatedError} 
            onRetry={retryTopRated} 
            sectionName="Top Rated Movies" 
          />
        ) : (
          <HorizontalScollCard 
            data={topRatedData} 
            heading={"⭐ Top Rated Movies"} 
            media_type={"movie"}
            loading={topRatedLoading}
          />
        )}

        {/* Airing Today TV */}
        {airingTodayError ? (
          <SectionErrorFallback 
            error={airingTodayError} 
            onRetry={retryAiringToday} 
            sectionName="Airing Today" 
          />
        ) : (
          <HorizontalScollCard 
            data={airingTodayTv} 
            heading={"📅 Airing Today"} 
            media_type={"tv"}
            loading={airingTodayLoading}
          />
        )}

        {/* On The Air Shows */}
        {onTheAirError ? (
          <SectionErrorFallback 
            error={onTheAirError} 
            onRetry={retryOnTheAir} 
            sectionName="On The Air" 
          />
        ) : (
          <HorizontalScollCard 
            data={onTheAirShowData} 
            heading={"🎭 On The Air"} 
            media_type={"tv"}
            loading={onTheAirLoading}
          />
        )}

        {/* My Collections */}
        {collections && collections.length > 0 && (
          <div className="container mx-auto px-4">
            <h2 className={`text-2xl font-bold mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              🎪 My Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.slice(0, 3).map((collection) => (
                <div 
                  key={collection.id}
                  className={`rounded-xl p-6 transition-all duration-200 hover:scale-105 cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border border-gray-700 hover:border-purple-500' 
                      : 'bg-white border border-gray-200 hover:border-purple-500 hover:shadow-lg'
                  }`}
                >
                  <h3 className={`font-bold text-lg mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {collection.name}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {collection.description}
                  </p>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    {collection.movies?.length || 0} movies
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
