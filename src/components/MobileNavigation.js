import React from 'react'
import { mobileNavigation } from '../contants/navigation'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MobileNavigation = () => {
    const theme = useSelector(state => state.cineNest.theme)
    const watchlist = useSelector(state => state.cineNest.watchlist)

    return (
        <section className={`lg:hidden h-16 fixed bottom-0 w-full z-40 border-t backdrop-blur-md ${
            theme === 'dark' 
                ? 'bg-black/80 border-gray-800' 
                : 'bg-white/80 border-gray-200'
        }`}>
            <div className='flex items-center justify-between h-full px-2'>
                {mobileNavigation.map((nav, index) => {
                    const isWatchlist = nav.href === '/watchlist'
                    const watchlistCount = isWatchlist ? watchlist.length : 0
                    
                    return (
                        <NavLink 
                            key={nav.label + "mobilenavigation"} 
                            to={nav.href}
                            className={({isActive}) => `relative flex-1 flex h-full items-center flex-col justify-center px-1 transition-all duration-200 ${
                                isActive 
                                    ? 'text-purple-500' 
                                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                            }`}
                        >
                            <div className='relative text-2xl mb-1'>
                                {nav.icon}
                                {/* Watchlist Badge */}
                                {isWatchlist && watchlistCount > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                                        {watchlistCount > 99 ? '99+' : watchlistCount}
                                    </div>
                                )}
                            </div>
                            <p className='text-xs font-medium'>{nav.label}</p>
                        </NavLink>
                    )
                })}
            </div>
        </section>
    )
}

export default MobileNavigation
