import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromFavorites, addToWatchlist, removeFromWatchlist } from '../store/CineSlice'
import { Link } from 'react-router-dom'
import { MdDelete, MdWatchLater, MdCheck } from 'react-icons/md'
import { BiSortAZ, BiSortZA } from 'react-icons/bi'
import { FiGrid, FiList, FiHeart } from 'react-icons/fi'
import moment from 'moment'
import toast from 'react-hot-toast'

const FavoritesPage = () => {
    const dispatch = useDispatch()
    const favorites = useSelector(state => state.cineNest.favorites)
    const watchlist = useSelector(state => state.cineNest.watchlist)
    const theme = useSelector(state => state.cineNest.theme)
    const imageURL = useSelector(state => state.cineNest.imageURL)
    
    const [sortBy, setSortBy] = useState('addedAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [viewMode, setViewMode] = useState('grid')
    const [filterType, setFilterType] = useState('all')

    const handleRemoveFromFavorites = (movieId) => {
        dispatch(removeFromFavorites(movieId))
        toast.success('Removed from favorites')
    }

    const handleToggleWatchlist = (movie) => {
        const isInWatchlist = watchlist.find(item => item.id === movie.id)
        if (isInWatchlist) {
            dispatch(removeFromWatchlist(movie.id))
            toast.success('Removed from watchlist')
        } else {
            dispatch(addToWatchlist(movie))
            toast.success('Added to watchlist')
        }
    }

    const filteredFavorites = favorites.filter(item => {
        if (filterType === 'all') return true
        if (filterType === 'movie') return item.media_type === 'movie' || !item.media_type
        if (filterType === 'tv') return item.media_type === 'tv'
        return true
    })

    const sortedFavorites = [...filteredFavorites].sort((a, b) => {
        let aValue, bValue
        
        switch (sortBy) {
            case 'title':
                aValue = (a.title || a.name || '').toLowerCase()
                bValue = (b.title || b.name || '').toLowerCase()
                break
            case 'rating':
                aValue = a.vote_average || 0
                bValue = b.vote_average || 0
                break
            case 'addedAt':
                aValue = new Date(a.addedAt || 0)
                bValue = new Date(b.addedAt || 0)
                break
            case 'releaseDate':
                aValue = new Date(a.release_date || a.first_air_date || 0)
                bValue = new Date(b.release_date || b.first_air_date || 0)
                break
            default:
                aValue = a.addedAt
                bValue = b.addedAt
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })

    return (
        <div className={`min-h-screen pt-16 pb-8 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            ❤️ My Favorites
                        </h1>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} you've loved
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 lg:mt-0">
                        {/* Filter by Type */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className={`px-3 py-2 rounded-lg border ${
                                theme === 'dark' 
                                    ? 'bg-gray-800 border-gray-700 text-white' 
                                    : 'bg-white border-gray-300 text-black'
                            }`}
                        >
                            <option value="all">All Types</option>
                            <option value="movie">Movies</option>
                            <option value="tv">TV Shows</option>
                        </select>

                        {/* Sort Options */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={`px-3 py-2 rounded-lg border ${
                                theme === 'dark' 
                                    ? 'bg-gray-800 border-gray-700 text-white' 
                                    : 'bg-white border-gray-300 text-black'
                            }`}
                        >
                            <option value="addedAt">Date Added</option>
                            <option value="title">Title</option>
                            <option value="rating">Rating</option>
                            <option value="releaseDate">Release Date</option>
                        </select>

                        {/* Sort Order */}
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className={`p-2 rounded-lg border transition-colors ${
                                theme === 'dark' 
                                    ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
                                    : 'bg-white border-gray-300 text-black hover:bg-gray-50'
                            }`}
                        >
                            {sortOrder === 'asc' ? <BiSortAZ size={20} /> : <BiSortZA size={20} />}
                        </button>

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
                    </div>
                </div>

                {/* Favorites Content */}
                {sortedFavorites.length === 0 ? (
                    <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <FiHeart className="mx-auto text-6xl mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                        <p className="mb-6">Start adding movies and TV shows you love!</p>
                        <Link 
                            to="/" 
                            className="inline-block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Discover Movies
                        </Link>
                    </div>
                ) : (
                    <div className={`${
                        viewMode === 'grid' 
                            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' 
                            : 'space-y-4'
                    }`}>
                        {sortedFavorites.map((item) => {
                            const isInWatchlist = watchlist.find(w => w.id === item.id)
                            
                            return viewMode === 'grid' ? (
                                // Grid View
                                <div 
                                    key={item.id} 
                                    className={`group relative rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
                                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                    } shadow-lg`}
                                >
                                    <Link to={`/${item.media_type || 'movie'}/${item.id}`}>
                                        <div className="aspect-[2/3] relative">
                                            <img
                                                src={imageURL + item.poster_path}
                                                alt={item.title || item.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                                        </div>
                                    </Link>
                                    
                                    {/* Actions */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleToggleWatchlist(item)}
                                            className="p-2 bg-black/70 rounded-full text-white hover:bg-black/90 transition-colors"
                                        >
                                            {isInWatchlist ? <MdCheck className="text-purple-500" /> : <MdWatchLater />}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromFavorites(item.id)}
                                            className="p-2 bg-black/70 rounded-full text-white hover:bg-red-600 transition-colors"
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <h3 className={`font-semibold text-sm mb-1 line-clamp-2 ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {item.title || item.name}
                                        </h3>
                                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Added {moment(item.addedAt).fromNow()}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // List View
                                <div 
                                    key={item.id}
                                    className={`flex items-center gap-4 p-4 rounded-lg ${
                                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                    } shadow-lg`}
                                >
                                    <Link to={`/${item.media_type || 'movie'}/${item.id}`}>
                                        <img
                                            src={imageURL + item.poster_path}
                                            alt={item.title || item.name}
                                            className="w-16 h-24 object-cover rounded"
                                        />
                                    </Link>
                                    
                                    <div className="flex-1">
                                        <Link to={`/${item.media_type || 'movie'}/${item.id}`}>
                                            <h3 className={`font-semibold text-lg mb-1 hover:text-purple-500 transition-colors ${
                                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {item.title || item.name}
                                            </h3>
                                        </Link>
                                        <p className={`text-sm mb-2 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {item.overview}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
                                            </span>
                                            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                📅 {item.release_date || item.first_air_date || 'TBA'}
                                            </span>
                                            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Added {moment(item.addedAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleWatchlist(item)}
                                            className={`p-2 rounded-full transition-colors ${
                                                isInWatchlist 
                                                    ? 'text-purple-500 hover:bg-purple-500/10' 
                                                    : theme === 'dark' ? 'text-gray-400 hover:text-purple-500' : 'text-gray-600 hover:text-purple-500'
                                            }`}
                                        >
                                            {isInWatchlist ? <MdCheck size={20} /> : <MdWatchLater size={20} />}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromFavorites(item.id)}
                                            className={`p-2 rounded-full transition-colors hover:text-red-500 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FavoritesPage 