import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    // Handle navbar appearance on scroll
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo on the left */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">DP</span>
              </div>
              <span className="ml-2 text-xl font-bold">Portfolio</span>
            </a>
          </div>
          
          {/* Menu Button */}
          <div>
            <button 
              onClick={toggleMenu}
              className="p-2 border border-white/30 rounded-md hover:bg-white/10 transition-all duration-300"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </div>
      
      {/* Menu Box on the right */}
      <div 
        className={`fixed top-20 right-4 bg-black/90 backdrop-blur-md z-40 rounded-lg shadow-xl border border-white/10 transform transition-all duration-300 w-64 py-4 px-2 ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col">
          <a 
            href="#about" 
            className="px-4 py-3 hover:bg-white/10 rounded-md transition-colors text-sm uppercase tracking-wide"
            onClick={toggleMenu}
          >
            About
          </a>
          <a 
            href="#work" 
            className="px-4 py-3 hover:bg-white/10 rounded-md transition-colors text-sm uppercase tracking-wide"
            onClick={toggleMenu}
          >
            Work
          </a>
          <a 
            href="#skills" 
            className="px-4 py-3 hover:bg-white/10 rounded-md transition-colors text-sm uppercase tracking-wide"
            onClick={toggleMenu}
          >
            Skills
          </a>
          <a 
            href="#contact" 
            className="px-4 py-3 hover:bg-white/10 rounded-md transition-colors text-sm uppercase tracking-wide"
            onClick={toggleMenu}
          >
            Contact
          </a>
          <div className="px-4 pt-2 pb-1">
            <button className="w-full button-hover border border-white/50 px-4 py-2 text-sm uppercase tracking-wide transition-all duration-300 hover:bg-white/10 rounded-md">
              Resume
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;