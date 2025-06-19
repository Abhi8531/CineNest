import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scrolling animation
    });
  }, [location.pathname, location.search]); // Run effect when pathname or query params change

  return null; // This component doesn't render anything
};

export default ScrollToTop; 