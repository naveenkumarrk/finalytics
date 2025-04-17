import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  CreditCard, 
  Menu, 
  X, 
  LogOut, 
  LogIn, 
  UserPlus, 
  User,
  ChevronDown
} from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scrolling effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-indigo-400' : 'text-gray-300';
  };

  return (
    <div className="relative z-50">
      <nav
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          scrolled 
            ? 'bg-gray-900/95 backdrop-blur-md shadow-xl' 
            : 'bg-gray-900'
        } px-6 sm:px-10 py-4`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="font-serif text-2xl font-bold text-white tracking-wider">
              FISCURA
              <span className="ml-1 inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={<Home size={16} />} text="Dashboard" active={isActive('/dashboard')} />
                <NavLink to="/loan-eligibility" icon={<CreditCard size={16} />} text="Loan Eligibility" active={isActive('/loan-eligibility')} />
                
                {/* Profile dropdown */}
                <div className="relative ml-3">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    <span className="mr-1">
                      <User size={16} className="inline mr-1" />
                      {user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 rounded-lg">
                  <LogIn size={16} className="inline mr-1" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transform transition-all duration-150 hover:scale-[1.02]"
                >
                  <UserPlus size={16} className="inline mr-1" />
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-gray-900 bg-opacity-95 backdrop-blur-md">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="border-b border-gray-700 pb-3 mb-3">
                  <div className="flex items-center px-3 py-2">
                    <User size={20} className="text-indigo-400 mr-2" />
                    <div>
                      <p className="text-white font-medium">{user?.email}</p>
                      <p className="text-gray-400 text-sm">Member</p>
                    </div>
                  </div>
                </div>
                
                <MobileNavLink to="/dashboard" icon={<Home size={20} />} text="Dashboard" active={isActive('/dashboard')} />
                <MobileNavLink to="/loan-eligibility" icon={<CreditCard size={20} />} text="Loan Eligibility" active={isActive('/loan-eligibility')} />
                <MobileNavLink to="/profile" icon={<User size={20} />} text="Profile" active={isActive('/profile')} />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-3 text-base text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <LogOut size={20} className="mr-3 text-gray-400" />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <>
                <div className="space-y-3 p-2">
                  <Link 
                    to="/login"
                    className="w-full flex items-center justify-center py-3 px-4 border border-gray-700 hover:border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </Link>
                  
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transform transition-all duration-150 hover:scale-[1.02]"
                  >
                    <UserPlus size={18} className="mr-2" />
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, icon, text, active }) => (
  <Link 
    to={to}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${active} hover:text-white hover:bg-gray-800 transition-colors duration-200`}
  >
    <span className="mr-1.5">{icon}</span>
    <span>{text}</span>
  </Link>
);

// Mobile Navigation Link
const MobileNavLink = ({ to, icon, text, active }) => (
  <Link 
    to={to}
    className={`flex items-center px-3 py-3 text-base ${active} hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200`}
  >
    <span className="mr-3 text-gray-400">{icon}</span>
    <span>{text}</span>
  </Link>
);

export default Navbar;