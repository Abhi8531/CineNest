import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUsername } from '../store/CineSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { setUserName } from '../utils/userUtils';

const WelcomeModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.cineNest.theme);
  const [inputName, setInputName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (inputName.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    if (inputName.trim().length > 20) {
      toast.error('Name must be less than 20 characters');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Set username using utility (which handles both localStorage and state)
      setUserName(inputName.trim());
      
      // Also update Redux store for immediate UI update
      dispatch(setUsername(inputName.trim()));
      
      toast.success(`Welcome to CineNest, ${inputName.trim()}! 🎬`, {
        duration: 4000,
        icon: '🎉',
      });
      
      onClose();
    } catch (error) {
      console.error('Error setting username:', error);
      toast.error('Failed to save your name. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setUserName('Movie Enthusiast');
    dispatch(setUsername('Movie Enthusiast'));
    toast.success('Welcome to CineNest! 🎬');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">🎬</span>
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome to CineNest!
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Your ultimate cinema discovery platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="username" 
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  What should we call you?
                </label>
                <div className="relative">
                  <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    id="username"
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  This will be stored with your IP address for personalization
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } disabled:opacity-50`}
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !inputName.trim()}
                  className={`flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSubmitting ? 'animate-pulse' : ''
                  }`}
                >
                  {isSubmitting ? 'Setting up...' : 'Get Started'}
                </button>
              </div>
            </form>

            {/* Features */}
            <div className={`mt-6 pt-6 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <p className={`text-xs text-center mb-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Your personal data will be automatically saved:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="text-purple-500">📝</span>
                  <span>Watchlist</span>
                </div>
                <div className={`flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="text-red-500">❤️</span>
                  <span>Favorites</span>
                </div>
                <div className={`flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="text-blue-500">📚</span>
                  <span>Collections</span>
                </div>
                <div className={`flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="text-green-500">⚙️</span>
                  <span>Preferences</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal; 