import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToWatchlist, removeFromWatchlist, addToFavorites, removeFromFavorites, updateViewingHistory } from '../store/CineSlice'
import { MdWatchLater, MdFavorite, MdFavoriteBorder, MdCheck } from 'react-icons/md'
import { BiPlay, BiCollection } from 'react-icons/bi'
import moment from 'moment'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import CollectionSelectModal from './CollectionSelectModal'

const Card = ({ data, trending, index, media_type }) => {
    const dispatch = useDispatch()
    const imageURL = useSelector(state => state.cineNest.imageURL)
    const watchlist = useSelector(state => state.cineNest.watchlist)
    const favorites = useSelector(state => state.cineNest.favorites)
    const theme = useSelector(state => state.cineNest.theme)
    
    const [showActions, setShowActions] = useState(false)
    const [showCollectionModal, setShowCollectionModal] = useState(false)
    
    const mediaType = data.media_type ?? media_type
    const isInWatchlist = watchlist.find(item => item.id === data.id)
    const isFavorite = favorites.find(item => item.id === data.id)

    const handleWatchlistToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (isInWatchlist) {
            dispatch(removeFromWatchlist(data.id))
            toast.success('Removed from watchlist')
        } else {
            dispatch(addToWatchlist({ ...data, media_type: mediaType }))
            toast.success('Added to watchlist')
        }
    }

    const handleFavoriteToggle = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (isFavorite) {
            dispatch(removeFromFavorites(data.id))
            toast.success('Removed from favorites')
        } else {
            dispatch(addToFavorites({ ...data, media_type: mediaType }))
            toast.success('Added to favorites')
        }
    }

    const handleCardClick = () => {
        dispatch(updateViewingHistory({ ...data, media_type: mediaType }))
    }

    const handleCollectionClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowCollectionModal(true)
    }

    return (
        <Link 
            to={`/${mediaType}/${data.id}`} 
            onClick={handleCardClick}
            className='group w-full min-w-[230px] max-w-[230px] h-80 overflow-hidden block rounded-xl relative transition-all duration-300 hover:scale-105 hover:shadow-2xl'
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Movie Poster */}
            <div className="relative h-full w-full">
                {data?.poster_path ? (
                    <img
                        src={imageURL + data?.poster_path}
                        alt={data?.title || data?.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className={`h-full w-full flex justify-center items-center ${
                        theme === 'dark' ? 'bg-neutral-800' : 'bg-gray-300'
                    }`}>
                        <div className="text-center">
                            <div className="text-4xl mb-2">🎬</div>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                No image found
                            </p>
                        </div>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300`} />

                {/* Play Button (appears on hover) */}
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BiPlay className="text-white text-3xl ml-1" />
                    </div>
                </div>
            </div>

            {/* Trending Badge */}
            <div className='absolute top-3 left-0'>
                {trending && (
                    <div className='py-1.5 px-3 backdrop-blur-md rounded-r-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white font-medium text-sm shadow-lg'>
                        #{index} Trending 🔥
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                showActions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}>
                {/* Watchlist Button */}
                <button
                    onClick={handleWatchlistToggle}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 ${
                        isInWatchlist 
                            ? 'bg-purple-500/90 text-white' 
                            : 'bg-black/60 text-white hover:bg-purple-500/90'
                    }`}
                    title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                    {isInWatchlist ? <MdCheck size={16} /> : <MdWatchLater size={16} />}
                </button>

                {/* Favorite Button */}
                <button
                    onClick={handleFavoriteToggle}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 ${
                        isFavorite 
                            ? 'bg-red-500/90 text-white' 
                            : 'bg-black/60 text-white hover:bg-red-500/90'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorite ? <MdFavorite size={16} /> : <MdFavoriteBorder size={16} />}
                </button>

                {/* Collection Button */}
                <button
                    onClick={handleCollectionClick}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 bg-black/60 text-white hover:bg-purple-500/90`}
                    title="Add to collection"
                >
                    <BiCollection size={16} />
                </button>
            </div>

            {/* Rating Badge */}
            {data.vote_average && (
                <div className="absolute top-3 left-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                        data.vote_average >= 8 
                            ? 'bg-green-500/90 text-white'
                            : data.vote_average >= 6
                            ? 'bg-yellow-500/90 text-black'
                            : 'bg-red-500/90 text-white'
                    }`}>
                        ⭐ {Number(data.vote_average).toFixed(1)}
                    </div>
                </div>
            )}

            {/* Movie Info */}
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-8'>
                <h2 className='text-white text-lg font-bold line-clamp-2 mb-1 group-hover:text-purple-300 transition-colors'>
                    {data?.title || data?.name}
                </h2>
                <div className='text-sm text-gray-300 flex justify-between items-center'>
                    <p className="text-xs">
                        {data.release_date || data.first_air_date 
                            ? moment(data.release_date || data.first_air_date).format("YYYY")
                            : 'Coming Soon'
                        }
                    </p>
                    <div className="flex items-center gap-2">
                        {mediaType && (
                            <span className="px-2 py-0.5 bg-white/20 rounded text-xs capitalize">
                                {mediaType === 'tv' ? 'TV Show' : 'Movie'}
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Genre or Overview Preview */}
                {data.overview && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {data.overview}
                    </p>
                )}
            </div>

            {/* Collection Modal */}
            <CollectionSelectModal 
                isOpen={showCollectionModal}
                onClose={() => setShowCollectionModal(false)}
                movie={{ ...data, media_type: mediaType }}
            />
        </Link>
    )
}

export default Card
