import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCollection, createCollection } from '../store/CineSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiCheck, FiFolder } from 'react-icons/fi';
import { BiCollection } from 'react-icons/bi';
import toast from 'react-hot-toast';

const CollectionSelectModal = ({ isOpen, onClose, movie }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.cineNest.theme);
  const collections = useSelector(state => state.cineNest.collections);
  
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Check which collections already contain this movie
  const movieInCollections = collections.filter(collection => 
    collection.movies?.some(m => m.id === movie?.id)
  );

  const handleAddToCollection = async (collectionId) => {
    if (!movie) return;

    try {
      dispatch(addToCollection({ collectionId, movie }));
      
      const collection = collections.find(c => c.id === collectionId);
      toast.success(`Added "${movie.title || movie.name}" to "${collection.name}"`, {
        duration: 3000,
        icon: '📚',
      });

      onClose();
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast.error('Failed to add to collection');
    }
  };

  const handleCreateNewCollection = async (e) => {
    e.preventDefault();
    
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    setIsCreating(true);

    try {
      const newCollection = {
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim() || `Custom collection: ${newCollectionName.trim()}`
      };

      dispatch(createCollection(newCollection));
      
      // Get the newly created collection ID (timestamp)
      const newCollectionId = Date.now();
      
      // Add movie to the new collection
      setTimeout(() => {
        dispatch(addToCollection({ collectionId: newCollectionId, movie }));
      }, 100);

      toast.success(`Created "${newCollectionName}" and added movie!`, {
        duration: 4000,
        icon: '🎉',
      });

      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowCreateNew(false);
      onClose();
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewCollectionName('');
    setNewCollectionDescription('');
    setShowCreateNew(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!movie) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={handleClose}
        >
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BiCollection className="text-white" size={20} />
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Add to Collection
                  </h2>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {movie.title || movie.name}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Movie Info */}
            <div className={`flex items-center gap-3 p-3 rounded-lg mb-6 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-12 h-18 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {movie.title || movie.name}
                </h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {movie.release_date || movie.first_air_date 
                    ? new Date(movie.release_date || movie.first_air_date).getFullYear()
                    : 'Unknown Year'
                  }
                </p>
              </div>
            </div>

            {/* Collections List */}
            <div className="space-y-3 mb-6">
              <h3 className={`font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Choose Collection:
              </h3>
              
              {collections.map((collection) => {
                const isInCollection = movieInCollections.some(c => c.id === collection.id);
                
                return (
                  <button
                    key={collection.id}
                    onClick={() => !isInCollection && handleAddToCollection(collection.id)}
                    disabled={isInCollection}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isInCollection
                        ? theme === 'dark' 
                          ? 'bg-green-900/20 border-green-500/30 cursor-not-allowed' 
                          : 'bg-green-50 border-green-200 cursor-not-allowed'
                        : theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 hover:border-purple-500 hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiFolder className={`${
                        isInCollection 
                          ? 'text-green-500' 
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div className="text-left">
                        <p className={`font-medium ${
                          isInCollection 
                            ? 'text-green-500' 
                            : theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {collection.name}
                        </p>
                        <p className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {collection.movies?.length || 0} movies
                        </p>
                      </div>
                    </div>
                    {isInCollection && (
                      <FiCheck className="text-green-500" size={20} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Create New Collection */}
            <div className="space-y-3">
              {!showCreateNew ? (
                <button
                  onClick={() => setShowCreateNew(true)}
                  className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed transition-colors ${
                    theme === 'dark' 
                      ? 'border-gray-600 hover:border-purple-500 text-gray-400 hover:text-purple-400' 
                      : 'border-gray-300 hover:border-purple-500 text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <FiPlus size={20} />
                  <span className="font-medium">Create New Collection</span>
                </button>
              ) : (
                <form onSubmit={handleCreateNewCollection} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Collection name"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      maxLength={50}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      autoFocus
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Description (optional)"
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      maxLength={200}
                      rows={2}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateNew(false)}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating || !newCollectionName.trim()}
                      className={`flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isCreating ? 'animate-pulse' : ''
                      }`}
                    >
                      {isCreating ? 'Creating...' : 'Create & Add'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollectionSelectModal; 