import React, { useRef } from 'react'
import Card from './Card'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { CardSkeleton } from './LoadingSpinner';

const HorizontalScollCard = ({ data = [], heading, trending, media_type, loading = false }) => {
    const containerRef = useRef()
    const theme = useSelector(state => state.cineNest?.theme || 'dark')

    const handleNext = () => {
        containerRef.current.scrollLeft += 300
    }
    
    const handlePrevious = () => {
        containerRef.current.scrollLeft -= 300
    }

    // If loading, show skeleton cards
    if (loading) {
        return (
            <div className='container mx-auto px-3 my-10'>
                <h2 className={`text-xl lg:text-2xl font-bold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                    {heading}
                </h2>
                
                <div className='relative'>
                    <div className={`grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-6 overflow-hidden overflow-x-auto relative z-10 scrollbar-none scroll-smooth transition-all`}>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // If no data and not loading, don't render
    if (!data || data.length === 0) {
        return null
    }

    return (
        <div className='container mx-auto px-3 my-10'>
            <h2 className={`text-xl lg:text-2xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
                {heading}
            </h2>
            
            <div className='relative'>
                <div ref={containerRef} className={`grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-6 overflow-hidden overflow-x-auto relative z-10 scrollbar-none scroll-smooth transition-all scrolbar-none`}>
                    {data.map((data, index) => {
                        return (
                            <Card 
                                key={data.id+"heading"+index} 
                                data={data} 
                                index={index+1} 
                                trending={trending}
                                media_type={media_type}
                            />
                        )
                    })}
                </div>

                {/* Previous Button */}
                <div className='absolute top-0 hidden lg:flex h-full items-center -left-2 z-20'>
                    <button 
                        onClick={handlePrevious} 
                        className={`p-2 rounded-full transition-all duration-300 ${
                            theme === 'dark' 
                                ? 'bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-700 hover:border-purple-500' 
                                : 'bg-white/80 hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-purple-500 shadow-lg'
                        } backdrop-blur-sm hover:scale-110`}
                        aria-label="Previous"
                    >
                        <FaAngleLeft size={20} />
                    </button>
                </div>

                {/* Next Button */}
                <div className='absolute top-0 hidden lg:flex h-full items-center -right-2 z-20'>
                    <button 
                        onClick={handleNext} 
                        className={`p-2 rounded-full transition-all duration-300 ${
                            theme === 'dark' 
                                ? 'bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-700 hover:border-purple-500' 
                                : 'bg-white/80 hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-purple-500 shadow-lg'
                        } backdrop-blur-sm hover:scale-110`}
                        aria-label="Next"
                    >
                        <FaAngleRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HorizontalScollCard
