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

    return (
        <header className={`fixed top-0 w-full h-16 backdrop-blur-md z-40 border-b transition-all duration-300 ${
            theme === 'dark' 
                ? 'bg-black/80 border-gray-800' 
                : 'bg-white/80 border-gray-200'
        }`}>
            <div className='container mx-auto px-4 flex items-center h-full'>
                {/* Logo */}
                <Link to={"/"} className="flex items-center space-x-2">
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

                {/* Navigation */}
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

                {/* Search & Actions */}
                <div className='ml-auto flex items-center gap-4'>
                    {/* Search */}
                    <form className='flex items-center' onSubmit={handleSubmit}>
                        <div className="relative">
                            <input
                                type='text'
                                placeholder='Search movies, shows...'
                                className={`w-64 max-w-[200px] lg:max-w-none px-4 py-2 pl-10 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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

                    {/* User Status Display */}
                    <UserStatusDisplay />

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
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`flex items-center space-x-2 p-2 rounded-full transition-all duration-200 hover:bg-purple-500/10 ${
                            theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                        }`}
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            {username ? (
                                <span className="text-white font-bold text-sm">
                                    {username.charAt(0).toUpperCase()}
                                </span>
                            ) : (
                                <FiUser className="text-white" size={16} />
                            )}
                        </div>
                        <FiChevronDown size={16} />
                    </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className={`absolute right-0 top-12 w-64 rounded-xl shadow-xl border py-2 z-50 ${
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
        </header>
    )
}

export default Header
