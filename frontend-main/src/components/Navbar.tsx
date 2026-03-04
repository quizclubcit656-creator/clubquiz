import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Members', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gold md:bg-dark-primary/95 backdrop-blur-md border-b border-gold/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-dark-primary md:bg-gradient-to-br md:from-gold md:to-gold-dark flex items-center justify-center">
              <span className="text-gold md:text-dark-primary font-bold text-xl">Q</span>
            </div>
            <span className="text-xl font-bold text-dark-primary md:text-white">Quiz Club CIT</span>
          </Link>

          <div className="hidden md:block">
            <div className="flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.path)
                    ? 'bg-gold text-dark-primary'
                    : 'text-gray-100 hover:bg-dark-secondary hover:text-gold'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dark-primary p-2 rounded-lg hover:bg-black/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gold border-t border-black/10 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-bold transition-all duration-300 ${isActive(link.path)
                  ? 'bg-dark-primary text-gold'
                  : 'text-dark-primary hover:bg-black/10'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
