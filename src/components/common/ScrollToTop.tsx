import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-slate-900/90 text-white dark:bg-white/90 dark:text-slate-900 shadow-xl border border-slate-700/50 dark:border-slate-200/50 backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-200 animate-fadeIn focus:outline-none focus:ring-2 focus:ring-rose-500"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};
