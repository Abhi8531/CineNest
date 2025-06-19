import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiHardDrive, FiCheck } from 'react-icons/fi';
import localStorageService from '../services/localStorageService';

const UserStatusDisplay = () => {
  const { 
    watchlist, 
    favorites, 
    collections, 
    username,
    lastSaveTime 
  } = useSelector(state => state.cineNest);
  
  const [showTooltip, setShowTooltip] = useState(false);
  const [userIP, setUserIP] = useState(null);

  useEffect(() => {
    // Get IP address once it's available
    const checkIP = () => {
      if (localStorageService.ipAddress) {
        setUserIP(localStorageService.ipAddress);
      } else {
        setTimeout(checkIP, 500);
      }
    };
    checkIP();
  }, []);

  const getTotalItems = () => {
    return watchlist.length + favorites.length + collections.reduce((acc, col) => acc + col.movies.length, 0);
  };

  const formatLastSave = () => {
    if (!lastSaveTime) return 'Not saved yet';
    
    const now = new Date();
    const save = new Date(lastSaveTime);
    const diff = now - save;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'Just saved';
    if (minutes < 60) return `Saved ${minutes}m ago`;
    return `Saved ${hours}h ago`;
  };

  const getDisplayIP = () => {
    if (!userIP) return 'Loading...';
    if (userIP.startsWith('fp_')) return 'Browser ID';
    return userIP.length > 12 ? `${userIP.slice(0, 8)}...` : userIP;
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Status Indicator */}
      <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-opacity-10 hover:bg-white transition-colors">
        <FiHardDrive className="text-green-400" size={16} />
        <span className="text-xs font-medium text-green-400">
          Local
        </span>
      </div>

      {/* Detailed Status Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Local Storage
              </h3>
              <div className="flex items-center gap-1">
                <FiCheck className="text-green-400" size={16} />
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>

            {/* Status Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                <span className="text-gray-800 dark:text-gray-200 font-mono text-xs">
                  {getDisplayIP()}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Username:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {username || 'Not set'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {getTotalItems()}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Last Save:</span>
                <span className="text-gray-800 dark:text-gray-200 text-xs">
                  {formatLastSave()}
                </span>
              </div>
            </div>

            {/* Storage Info */}
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <FiCheck className="flex-shrink-0" />
              <span>Data stored locally on your device by IP address</span>
            </div>

            {/* Info Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Your data is automatically saved locally and identified by your IP address
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatusDisplay; 