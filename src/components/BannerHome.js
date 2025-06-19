import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { FiPlay, FiInfo } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';

const BannerHome = () => {
    const bannerData = useSelector(state => state.cineNest.bannerData)
    const imageURL = useSelector(state => state.cineNest.imageURL)
    const theme = useSelector(state => state.cineNest.theme)
    const [currentImage, setCurrentImage] = useState(0)
    const navigate = useNavigate()

    const handleNext = () => {
        if(currentImage < bannerData.length - 1) {
            setCurrentImage(prev => prev + 1)
        }
    }
    
    const handlePrevious = () => {
        if(currentImage > 0) {
            setCurrentImage(prev => prev - 1)
        }
    }

    const handleBannerClick = (data) => {
        navigate(`/${data?.media_type}/${data.id}`)
    }

    useEffect(() => {
        if (bannerData.length === 0) return

        const interval = setInterval(() => {
            if(currentImage < bannerData.length - 1) {
                handleNext()
            } else {
                setCurrentImage(0)
            }
        }, 5000)

        return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bannerData, currentImage])

    if (!bannerData.length) {
        return (
            <section className={`w-full h-[450px] lg:h-[95vh] flex items-center justify-center ${
                theme === 'dark' ? 'bg-neutral-900' : 'bg-gray-100'
            }`}>
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Loading featured content...
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className='w-full h-full relative'>
            <div className='flex min-h-[450px] max-h-[95vh] lg:min-h-[95vh] overflow-hidden'>
                {bannerData.map((data, index) => {
                    return (
                        <div 
                            key={data.id + "bannerHome" + index} 
                            className='min-w-full min-h-[450px] lg:min-h-full overflow-hidden relative group transition-all duration-700 ease-in-out cursor-pointer' 
                            style={{ transform: `translateX(-${currentImage * 100}%)` }}
                            onClick={() => handleBannerClick(data)}
                        >
                            {/* Background Image */}
                            <div className='w-full h-full relative'>
                                <img
                                    src={imageURL + data.backdrop_path}
                                    alt={data?.title || data?.name}
                                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                    loading="lazy"
                                />
                                
                                {/* Gradient Overlays */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>
                                <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent'></div>
                                
                                {/* Hover Overlay */}
                                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300'></div>
                                
                                {/* Play Icon on Hover */}
                                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none'>
                                    <div className='w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
                                        <FiPlay className='text-white text-3xl ml-1' />
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className='absolute top-0 w-full h-full hidden items-center justify-between px-4 group-hover:lg:flex z-30 pointer-events-none'>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handlePrevious();
                                    }} 
                                    className='bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full text-xl text-white transition-all duration-200 hover:scale-110 pointer-events-auto'
                                    disabled={currentImage === 0}
                                >
                                    <FaAngleLeft/>
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleNext();
                                    }} 
                                    className='bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full text-xl text-white transition-all duration-200 hover:scale-110 pointer-events-auto'
                                    disabled={currentImage === bannerData.length - 1}
                                >
                                    <FaAngleRight/>
                                </button>
                            </div>

                            {/* Content */}
                            <div className='container mx-auto absolute inset-0 pointer-events-none'>
                                <div className='w-full absolute bottom-0 max-w-2xl px-4 pb-8 lg:pb-16 z-20'>
                                    {/* Title */}
                                    <h1 className='font-bold text-3xl lg:text-6xl text-white drop-shadow-2xl mb-4 leading-tight'>
                                        {data?.title || data?.name}
                                    </h1>
                                    
                                    {/* Description */}
                                    <p className='text-gray-200 text-lg line-clamp-3 mb-6 max-w-xl leading-relaxed drop-shadow-lg'>
                                        {data.overview}
                                    </p>
                                    
                                    {/* Stats */}
                                    <div className='flex flex-wrap items-center gap-3 lg:gap-6 mb-6 text-white/90'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-yellow-400'>⭐</span>
                                            <span className='font-semibold'>{Number(data.vote_average).toFixed(1)}</span>
                                        </div>
                                        <div className='w-1 h-1 bg-white/50 rounded-full hidden sm:block'></div>
                                        <div className='flex items-center gap-2'>
                                            <span>👀</span>
                                            <span>{Number(data.popularity).toFixed(0)} views</span>
                                        </div>
                                        <div className='w-1 h-1 bg-white/50 rounded-full hidden sm:block'></div>
                                        <div className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm'>
                                            {data?.media_type === 'tv' ? 'TV Show' : 'Movie'}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto'>
                                        <Link 
                                            to={`/${data?.media_type}/${data.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-block"
                                        >
                                            <button className='flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 sm:px-8 py-3 sm:py-4 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl w-full sm:w-auto justify-center'>
                                                <FiPlay size={20} />
                                                Watch Now
                                            </button>
                                        </Link>
                                        
                                        <Link 
                                            to={`/${data?.media_type}/${data.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="inline-block"
                                        >
                                            <button className='flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 sm:px-6 py-3 sm:py-4 text-white font-semibold rounded-xl border border-white/30 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto justify-center'>
                                                <FiInfo size={20} />
                                                More Info
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Dots Indicator */}
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30'>
                {bannerData.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImage(index);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            currentImage === index 
                                ? 'bg-white scale-125' 
                                : 'bg-white/50 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>

            {/* Mobile Navigation Arrows */}
            <div className='lg:hidden absolute top-1/2 transform -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none z-30'>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePrevious();
                    }} 
                    className='bg-black/40 backdrop-blur-sm hover:bg-black/60 p-2 rounded-full text-white transition-all duration-200 pointer-events-auto'
                    disabled={currentImage === 0}
                >
                    <FaAngleLeft size={16}/>
                </button>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNext();
                    }} 
                    className='bg-black/40 backdrop-blur-sm hover:bg-black/60 p-2 rounded-full text-white transition-all duration-200 pointer-events-auto'
                    disabled={currentImage === bannerData.length - 1}
                >
                    <FaAngleRight size={16}/>
                </button>
            </div>
        </section>
    )
}

export default BannerHome
