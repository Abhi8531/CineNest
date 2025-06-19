import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { IoSearchOutline, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { FiUser, FiChevronDown } from "react-icons/fi";
import { navigation, userNavigation } from '../contants/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/CineSlice';
import UserStatusDisplay from './UserStatusDisplay';

const Header = () => {
    const location = useLocation()
    const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ")
    const [searchInput, setSearchInput] = useState(removeSpace)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const theme = useSelector(state => state.cineNest.theme)
    const watchlist = useSelector(state => state.cineNest.watchlist)
    const favorites = useSelector(state => state.cineNest.favorites)
    const username = useSelector(state => state.cineNest.username)
   
    useEffect(() => {
        if(searchInput) {
            navigate(`/search?q=${searchInput}`)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput])

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const handleThemeToggle = () => {
        dispatch(toggleTheme())
    }

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowUserMenu(false)
        }
        
        if (showUserMenu) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [showUserMenu])

    return (
        <header className={`fixed top-0 w-full h-16 backdrop-blur-md z-40 border-b transition-all duration-300 ${
            theme === 'dark' 
                ? 'bg-black/80 border-gray-800' 
                : 'bg-white/80 border-gray-200'
        }`}>
            <div className='container mx-auto px-4 flex items-center h-full'>
                {/* Logo */}
                <Link to={"/"} className="flex items-center space-x-2 flex-shrink-0">
                    <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">🎬</span>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className={`text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}>
                            CineNest
                        </h1>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Discover Cinema
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className='hidden lg:flex items-center gap-1 ml-8'>
                    {navigation.map((nav, index) => (
                        <NavLink 
                            key={nav.label + "header" + index} 
                            to={nav.href} 
                            className={({isActive}) => `px-3 py-2 rounded-lg transition-all duration-200 hover:bg-purple-500/10 ${
                                isActive 
                                    ? 'text-purple-500 bg-purple-500/10' 
                                    : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                            }`}
                        >
                            <span className="flex items-center space-x-2">
                                {nav.icon}
                                <span className="text-sm font-medium">{nav.label}</span>
                            </span>
                        </NavLink>
                    ))}
                </nav>

                {/* Actions */}
                <div className='ml-auto flex items-center gap-2 sm:gap-4'>
                    {/* Desktop Search */}
                    <form className='hidden md:flex items-center' onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type='text'
                                placeholder='Search movies, shows...'
                                className={`w-48 lg:w-64 px-4 py-2 pl-10 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                                        : 'bg-gray-50 border-gray-300 text-black placeholder-gray-500'
                                }`}
                                onChange={(e) => setSearchInput(e.target.value)}
                                value={searchInput}
                            />
                            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </form>

                    {/* Mobile Search Button */}
                    <button 
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className={`md:hidden p-2 rounded-full transition-all duration-200 hover:bg-purple-500/10 ${
                            theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                        }`}
                    >
                        <IoSearchOutline size={20} />
                    </button>

                    {/* User Status Display - Always visible */}
                    <div className="block">
                        <UserStatusDisplay />
                    </div>

                    {/* Theme Toggle */}
                    <button 
                        onClick={handleThemeToggle}
                        className={`p-2 rounded-full transition-all duration-200 hover:bg-purple-500/10 ${
                            theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                        }`}
                    >
                        {theme === 'dark' ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowUserMenu(!showUserMenu);
                            }}
                            className={`flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-full transition-all duration-200 hover:bg-purple-500/10 ${
                                theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                            }`}
                        >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                {username ? (
                                    <span className="text-white font-bold text-xs sm:text-sm">
                                        {username.charAt(0).toUpperCase()}
                                    </span>
                                ) : (
                                    <FiUser className="text-white" size={14} />
                                )}
                            </div>
                            <FiChevronDown size={14} className="hidden sm:block" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className={`absolute right-0 top-12 w-56 sm:w-64 rounded-xl shadow-xl border py-2 z-50 ${
                                theme === 'dark' 
                                    ? 'bg-gray-800 border-gray-700' 
                                    : 'bg-white border-gray-200'
                            }`}>
                                <div className="px-4 py-3 border-b border-gray-700">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            {username ? (
                                                <span className="text-white font-bold text-lg">
                                                    {username.charAt(0).toUpperCase()}
                                                </span>
                                            ) : (
                                                <FiUser className="text-white" size={18} />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                                {username || 'Movie Enthusiast'}
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {watchlist.length} watchlist • {favorites.length} favorites
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {userNavigation.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.href}
                                        onClick={() => setShowUserMenu(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 transition-colors hover:bg-purple-500/10 ${
                                            theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                                        }`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <div className={`md:hidden absolute top-16 left-0 right-0 p-4 border-b ${
                    theme === 'dark' 
                        ? 'bg-black/95 border-gray-800' 
                        : 'bg-white/95 border-gray-200'
                }`}>
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type='text'
                                placeholder='Search movies, shows...'
                                className={`w-full px-4 py-3 pl-12 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    theme === 'dark' 
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                                        : 'bg-gray-50 border-gray-300 text-black placeholder-gray-500'
                                }`}
                                onChange={(e) => setSearchInput(e.target.value)}
                                value={searchInput}
                                autoFocus
                            />
                            <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </form>
                </div>
            )}
        </header>
    )
}

export default Header
