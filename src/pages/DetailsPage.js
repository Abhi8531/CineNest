import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useFetchDetails from '../hooks/useFetchDetails'
import { useSelector, useDispatch } from 'react-redux'
import { addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, updateViewingHistory } from '../store/CineSlice'
import { MdWatchLater, MdFavorite, MdFavoriteBorder, MdCheck, MdShare } from 'react-icons/md'
import { FiPlay, FiCalendar, FiClock, FiStar } from 'react-icons/fi'
import { BiCollection } from 'react-icons/bi'
import moment from 'moment'
import toast from 'react-hot-toast'
import HorizontalScollCard from '../components/HorizontalScollCard'
import VideoPlay from '../components/VideoPlay'
import ErrorFallback from '../components/ErrorFallback'
import LoadingSpinner from '../components/LoadingSpinner'
import CollectionSelectModal from '../components/CollectionSelectModal'

const DetailsPage = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const imageURL = useSelector(state => state.cineNest.imageURL)
  const theme = useSelector(state => state.cineNest.theme)
  const watchlist = useSelector(state => state.cineNest.watchlist)
  const favorites = useSelector(state => state.cineNest.favorites)
  
  const { data, loading: detailsLoading, error: detailsError, retry: retryDetails } = useFetchDetails(`/${params?.explore}/${params?.id}`)
  const { data: castData, loading: castLoading } = useFetchDetails(`/${params?.explore}/${params?.id}/credits`)
  const { data: similarData } = useFetch(`/${params?.explore}/${params?.id}/similar`)
  const { data: recommendationData } = useFetch(`/${params?.explore}/${params?.id}/recommendations`)
  
  const [playVideo, setPlayVideo] = useState(false)
  const [playVideoId, setPlayVideoId] = useState("")
  const [showCollectionModal, setShowCollectionModal] = useState(false)

  const isInWatchlist = watchlist.find(item => item.id === data?.id)
  const isFavorite = favorites.find(item => item.id === data?.id)

  // Scroll to top when movie/show ID changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instant scroll for details page
    });
  }, [params?.id, params?.explore]); // Run when ID or explore type changes

  const handlePlayVideo = (videoData) => {
    setPlayVideoId(videoData)
    setPlayVideo(true)
    dispatch(updateViewingHistory({ ...data, media_type: params?.explore }))
  }

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(data.id))
      toast.success('Removed from watchlist')
    } else {
      dispatch(addToWatchlist({ ...data, media_type: params?.explore }))
      toast.success('Added to watchlist')
    }
  }

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(data.id))
      toast.success('Removed from favorites')
    } else {
      dispatch(addToFavorites({ ...data, media_type: params?.explore }))
      toast.success('Added to favorites')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: data?.title || data?.name,
          text: data?.overview,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleCollectionClick = () => {
    setShowCollectionModal(true)
  }

  if (detailsError) {
    return <ErrorFallback error={detailsError} onRetry={retryDetails} />
  }

  if (detailsLoading) {
    return <LoadingSpinner size="xl" text="Loading details..." fullScreen />
  }

  if (!data) {
    return <ErrorFallback title="Content Not Found" message="The requested content could not be found." />
  }

  const duration = (data?.runtime / 60)?.toFixed(1)?.split(".")
  const writer = castData?.crew?.filter(el => el?.job === "Writer")?.map(el => el?.name)?.join(", ")
  const director = castData?.crew?.find(el => el?.job === "Director")?.name

  return (
    <div className={`${theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'} min-h-screen`}>
      {/* Hero Section */}
      <div className='w-full h-[400px] relative hidden lg:block'>
        <div className='w-full h-full'>
          <img
            src={imageURL + data?.backdrop_path}
            alt={data?.title || data?.name}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent'></div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8 lg:py-0'>
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          {/* Poster & Actions */}
          <div className='relative mx-auto lg:-mt-32 lg:mx-0 w-fit min-w-[280px]'>
            <div className='relative group'>
              <img
                src={imageURL + data?.poster_path}
                alt={data?.title || data?.name}
                className='h-96 w-64 object-cover rounded-xl shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-300'
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl'></div>
            </div>

            {/* Action Buttons */}
            <div className='mt-6 space-y-3'>
              <button
                onClick={() => handlePlayVideo(data)}
                className='w-full flex items-center justify-center gap-3 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg'
              >
                <FiPlay size={20} />
                Watch Now
              </button>

              <div className='grid grid-cols-2 gap-2 mb-3'>
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
                    isInWatchlist
                      ? theme === 'dark' ? 'bg-purple-500 border-purple-500 text-white' : 'bg-purple-500 border-purple-500 text-white'
                      : theme === 'dark' ? 'border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400' : 'border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600'
                  }`}
                >
                  {isInWatchlist ? <MdCheck size={18} /> : <MdWatchLater size={18} />}
                  <span className='text-sm'>Watchlist</span>
                </button>

                <button
                  onClick={handleFavoriteToggle}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
                    isFavorite
                      ? 'bg-red-500 border-red-500 text-white'
                      : theme === 'dark' ? 'border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400' : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                  }`}
                >
                  {isFavorite ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
                  <span className='text-sm'>Favorite</span>
                </button>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <button
                  onClick={handleCollectionClick}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
                    theme === 'dark' ? 'border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400' : 'border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600'
                  }`}
                >
                  <BiCollection size={18} />
                  <span className='text-sm'>Collection</span>
                </button>

                <button
                  onClick={handleShare}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all duration-200 ${
                    theme === 'dark' ? 'border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400' : 'border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600'
                  }`}
                >
                  <MdShare size={18} />
                  <span className='text-sm'>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className='flex-1'>
            <h1 className={`text-3xl lg:text-5xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {data?.title || data?.name}
            </h1>
            
            {data?.tagline && (
              <p className={`text-lg italic mb-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                "{data.tagline}"
              </p>
            )}

            {/* Stats */}
            <div className='flex flex-wrap items-center gap-6 mb-8'>
              <div className='flex items-center gap-2'>
                <FiStar className='text-yellow-400' />
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {Number(data?.vote_average).toFixed(1)}
                </span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  ({Number(data?.vote_count).toLocaleString()} votes)
                </span>
              </div>

              {duration && (
                <>
                  <div className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                  <div className='flex items-center gap-2'>
                    <FiClock className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {duration[0]}h {duration[1]}m
                    </span>
                  </div>
                </>
              )}

              <div className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
              <div className='flex items-center gap-2'>
                <FiCalendar className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {moment(data?.release_date || data?.first_air_date).format("YYYY")}
                </span>
              </div>

              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                {data?.status}
              </div>
            </div>

            {/* Genres */}
            {data?.genres && (
              <div className='flex flex-wrap gap-2 mb-8'>
                {data.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className='mb-8'>
              <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Overview
              </h3>
              <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {data?.overview}
              </p>
            </div>

            {/* Additional Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              {director && (
                <div>
                  <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Director
                  </h4>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {director}
                  </p>
                </div>
              )}

              {writer && (
                <div>
                  <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Writer
                  </h4>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {writer}
                  </p>
                </div>
              )}

              {data?.revenue && (
                <div>
                  <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Revenue
                  </h4>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    ${Number(data.revenue).toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Release Date
                </h4>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {moment(data?.release_date || data?.first_air_date).format("MMMM Do, YYYY")}
                </p>
              </div>
            </div>

            {/* Cast */}
            {!castLoading && castData?.cast && (
              <div>
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Cast
                </h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                  {castData.cast.filter(el => el?.profile_path).slice(0, 12).map((starCast, index) => (
                    <div key={index} className='text-center'>
                      <div className='relative group mb-2'>
                        <img
                          src={imageURL + starCast?.profile_path}
                          alt={starCast?.name}
                          className='w-20 h-20 object-cover rounded-full mx-auto group-hover:scale-105 transition-transform duration-200'
                        />
                      </div>
                      <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {starCast?.name}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {starCast?.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Content */}
      <div className='mt-16'>
        <HorizontalScollCard 
          data={similarData} 
          heading={`More Like This`} 
          media_type={params?.explore}
        />
        <HorizontalScollCard 
          data={recommendationData} 
          heading={`Recommended ${params?.explore === 'tv' ? 'Shows' : 'Movies'}`} 
          media_type={params?.explore}
        />
      </div>

      {/* Video Player Modal */}
      {playVideo && (
        <VideoPlay 
          data={playVideoId} 
          close={() => setPlayVideo(false)} 
          media_type={params?.explore}
        />
      )}

      {/* Collection Modal */}
      <CollectionSelectModal 
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        movie={{ ...data, media_type: params?.explore }}
      />
    </div>
  )
}

export default DetailsPage
