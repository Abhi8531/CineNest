import React from 'react'
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import useFetchDetails from '../hooks/useFetchDetails';
import LoadingSpinner from './LoadingSpinner';

const VideoPlay = ({ data, close, media_type }) => {
  const theme = useSelector(state => state.cineNest?.theme || 'dark')
  const { data: videoData, loading, error } = useFetchDetails(`/${media_type}/${data?.id}/videos`)

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  return (
    <section 
      className='fixed inset-0 z-50 flex justify-center items-center bg-black/80 backdrop-blur-sm p-4'
      onClick={handleBackdropClick}
    > 
      <div className={`w-full max-h-[80vh] max-w-4xl aspect-video rounded-xl relative overflow-hidden ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } shadow-2xl`}>
        
        {/* Close Button */}
        <button 
          onClick={close} 
          className='absolute right-4 top-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors'
          aria-label="Close video"
        >
          <IoClose size={24} />
        </button>

        {/* Loading State */}
        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading video..." />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">❌</div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Video Unavailable
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Unable to load video content
              </p>
            </div>
          </div>
        )}

        {/* Video Content */}
        {!loading && !error && videoData?.results?.length > 0 && (
          <iframe
            src={`https://www.youtube.com/embed/${videoData.results[0].key}?autoplay=1&rel=0&modestbranding=1`}
            title={`${data?.title || data?.name} - Video`}
            className='w-full h-full border-0'
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* No Video Available */}
        {!loading && !error && (!videoData?.results || videoData.results.length === 0) && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No Video Available
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Video content is not available for this title
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default VideoPlay
