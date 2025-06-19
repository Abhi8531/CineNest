import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createCollection, removeFromCollection } from '../store/CineSlice'
import { Link } from 'react-router-dom'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CollectionsPage = () => {
    const dispatch = useDispatch()
    const collections = useSelector(state => state.cineNest.collections)
    const theme = useSelector(state => state.cineNest.theme)
    const imageURL = useSelector(state => state.cineNest.imageURL)
    
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newCollectionName, setNewCollectionName] = useState('')
    const [newCollectionDescription, setNewCollectionDescription] = useState('')
    const [selectedCollection, setSelectedCollection] = useState(null)

    const handleCreateCollection = (e) => {
        e.preventDefault()
        if (newCollectionName.trim()) {
            dispatch(createCollection({
                name: newCollectionName.trim(),
                description: newCollectionDescription.trim()
            }))
            toast.success('Collection created successfully!')
            setNewCollectionName('')
            setNewCollectionDescription('')
            setShowCreateModal(false)
        }
    }

    const handleRemoveFromCollection = (collectionId, movieId) => {
        dispatch(removeFromCollection({ collectionId, movieId }))
        toast.success('Movie removed from collection')
    }

    return (
        <div className={`min-h-screen pt-16 pb-8 ${theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            🎪 My Collections
                        </h1>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Organize your favorite movies into custom collections
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mt-4 lg:mt-0"
                    >
                        <MdAdd size={20} />
                        Create Collection
                    </button>
                </div>

                {/* Collections Grid */}
                {collections.length === 0 ? (
                    <div className={`text-center py-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div className="text-6xl mb-4">🎪</div>
                        <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
                        <p className="mb-6">Create your first collection to organize your favorite movies!</p>
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="inline-block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                            Create Collection
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection) => (
                            <div 
                                key={collection.id}
                                className={`rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 border border-gray-700 hover:border-purple-500' 
                                        : 'bg-white border border-gray-200 hover:border-purple-500 hover:shadow-lg'
                                } shadow-lg`}
                                onClick={() => setSelectedCollection(collection)}
                            >
                                {/* Collection Preview */}
                                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden">
                                    {collection.movies.length > 0 ? (
                                        <div className="grid grid-cols-3 h-full">
                                            {collection.movies.slice(0, 3).map((movie, index) => (
                                                <img
                                                    key={movie.id}
                                                    src={imageURL + movie.poster_path}
                                                    alt={movie.title || movie.name}
                                                    className="w-full h-full object-cover opacity-80"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="text-4xl text-white/50">🎬</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/20" />
                                </div>

                                {/* Collection Info */}
                                <div className="p-6">
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
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs ${
                                            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                                        }`}>
                                            {collection.movies.length} {collection.movies.length === 1 ? 'movie' : 'movies'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    // Edit functionality can be added here
                                                }}
                                                className={`p-1 rounded transition-colors hover:bg-purple-500/10 ${
                                                    theme === 'dark' ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'
                                                }`}
                                            >
                                                <MdEdit size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Collection Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className={`w-full max-w-md rounded-xl p-6 ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Create New Collection
                                </h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className={`p-1 rounded transition-colors hover:bg-gray-500/10 ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateCollection}>
                                <div className="mb-4">
                                    <label className={`block text-sm font-medium mb-2 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Collection Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newCollectionName}
                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                        placeholder="e.g., Weekend Favorites"
                                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                            theme === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-black placeholder-gray-500'
                                        }`}
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className={`block text-sm font-medium mb-2 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Description (optional)
                                    </label>
                                    <textarea
                                        value={newCollectionDescription}
                                        onChange={(e) => setNewCollectionDescription(e.target.value)}
                                        placeholder="Describe your collection..."
                                        rows={3}
                                        className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                            theme === 'dark' 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-black placeholder-gray-500'
                                        }`}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                                            theme === 'dark' 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Collection Detail Modal */}
                {selectedCollection && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">
                                            {selectedCollection.name}
                                        </h2>
                                        <p className="text-purple-100">{selectedCollection.description}</p>
                                        <p className="text-purple-200 text-sm mt-1">
                                            {selectedCollection.movies.length} {selectedCollection.movies.length === 1 ? 'movie' : 'movies'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCollection(null)}
                                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                {selectedCollection.movies.length === 0 ? (
                                    <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <div className="text-4xl mb-4">🎬</div>
                                        <h3 className="text-lg font-semibold mb-2">Collection is empty</h3>
                                        <p>Start adding movies to this collection!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {selectedCollection.movies.map((movie) => (
                                            <div key={movie.id} className="group relative">
                                                <Link to={`/${movie.media_type || 'movie'}/${movie.id}`}>
                                                    <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
                                                        <img
                                                            src={imageURL + movie.poster_path}
                                                            alt={movie.title || movie.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
                                                    </div>
                                                </Link>
                                                
                                                <button
                                                    onClick={() => handleRemoveFromCollection(selectedCollection.id, movie.id)}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                >
                                                    <MdDelete size={16} />
                                                </button>

                                                <h3 className={`text-sm font-medium mt-2 line-clamp-2 ${
                                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {movie.title || movie.name}
                                                </h3>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CollectionsPage 