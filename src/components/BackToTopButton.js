import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useSelector(state => state.cineNest.theme);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            theme === 'dark'
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
          title="Back to top"
          aria-label="Scroll back to top"
        >
          <FiArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default BackToTopButton; 