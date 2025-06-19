import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiHeart, FiGithub, FiMail, FiInstagram } from 'react-icons/fi'

const Footer = () => {
  const theme = useSelector(state => state.cineNest.theme)

  return (
    <footer className={`border-t transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-neutral-900 border-gray-800 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-700'
    }`}>
      <div className='container mx-auto px-4 py-8'>
        
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
          
          {/* CineNest Brand */}
          <div className='md:col-span-2'>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎬</span>
              </div>
              <h3 className={`text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}>
                CineNest
              </h3>
            </div>
            <p className={`mb-4 max-w-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your ultimate cinema discovery platform. Explore movies, TV shows, and build your personal entertainment collection.
            </p>
            <div className='flex items-center gap-4'>
              <a 
                href="https://github.com/Abhi8531" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-black'
                }`}
                aria-label="GitHub - Opens in new window"
                title="Visit GitHub Profile"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="https://instagram.com/abhishek_vnagar"
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-pink-400' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-pink-600'
                }`}
                aria-label="Instagram - Opens in new window"
                title="Visit Instagram Profile"
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="mailto:abhiforcoding@gmail.com"
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-black'
                }`}
                aria-label="Email - Opens in mail app"
                title="Send Email"
                onClick={(e) => {
                  try {
                    // First try the simple mailto approach
                    const mailtoLink = "mailto:abhiforcoding@gmail.com?subject=Hello from CineNest&body=Hi, I found your CineNest project and wanted to reach out!"
                    
                    // Check if we're on mobile or desktop
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                    
                    if (isMobile) {
                      // On mobile, use window.location
                      window.location.href = mailtoLink
                    } else {
                      // On desktop, try to open in a way that works better
                      const tempLink = document.createElement('a')
                      tempLink.href = mailtoLink
                      tempLink.style.display = 'none'
                      document.body.appendChild(tempLink)
                      tempLink.click()
                      document.body.removeChild(tempLink)
                    }
                    
                    // Fallback: show copy email address option
                    setTimeout(() => {
                      if (window.confirm('If your email app didn\'t open, would you like to copy the email address to clipboard?')) {
                        navigator.clipboard.writeText('abhiforcoding@gmail.com').then(() => {
                          alert('Email address copied to clipboard: abhiforcoding@gmail.com')
                        }).catch(() => {
                          prompt('Copy this email address:', 'abhiforcoding@gmail.com')
                        })
                      }
                    }, 1000)
                    
                  } catch (error) {
                    console.error('Email error:', error)
                    // Ultimate fallback - copy to clipboard
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText('abhiforcoding@gmail.com')
                      alert('Email address copied to clipboard: abhiforcoding@gmail.com')
                    } else {
                      prompt('Copy this email address:', 'abhiforcoding@gmail.com')
                    }
                  }
                }}
              >
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Explore
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link 
                  to="/movie" 
                  className={`transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-purple-400' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link 
                  to="/tv" 
                  className={`transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-purple-400' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  TV Shows
                </Link>
              </li>
              <li>
                <Link 
                  to="/trending" 
                  className={`transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-purple-400' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link 
                  to="/top-rated" 
                  className={`transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-purple-400' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Top Rated
                </Link>
              </li>
            </ul>
          </div>

          {/* My Lists */}
          <div>
            <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              My Lists
            </h4>
            <ul className='space-y-2'>
              <li>
                <Link 
                  to="/watchlist" 
                  className={`transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-purple-400' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Watchlist
                </Link>
              </li>
              <li>
                <Link 
                  to="/favorites" 
                  className={`transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-purple-400' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link 
                  to="/collections" 
                  className={`transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-purple-400' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  Collections
                </Link>
              </li>

            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between pt-8 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className='flex items-center gap-2 mb-4 sm:mb-0'>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Made with
            </p>
            <FiHeart className='text-red-500' size={16} />
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              for movie lovers everywhere
            </p>
          </div>
          
          <div className='flex items-center gap-4 text-sm'>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 CineNest. All rights reserved.
            </p>
            <span className={`text-xs px-2 py-1 rounded ${
              theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              Powered by TMDB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
