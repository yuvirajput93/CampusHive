import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo.jpeg";
import SearchBar from './SearchBar';

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const activeLinkStyle = {
    color: 'white',
    fontWeight: 'bold',
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-xl font-bold text-white tracking-wider">
            CampusHive
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {currentUser ? (
            <>
              <NavLink to="/feed" className="text-gray-300 hover:text-white transition" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Explore</NavLink>
              <NavLink to="/anonymous" className="text-gray-300 hover:text-white transition" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Anonymous🎭</NavLink>
              <SearchBar />
              <NavLink to={`/profile/${currentUser._id}`} className="flex items-center gap-2">
                <img src={currentUser.profilePic || `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}&background=4f46e5&color=fff`} alt="profile" className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-purple-500 transition" />
              </NavLink>
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white transition"><FiLogOut /><span>Logout</span></button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition">Sign In</Link>
              <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition">Sign Up</Link>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/80 backdrop-blur-xl absolute top-full left-0 w-full">
          <nav className="flex flex-col items-center gap-4 py-6">
            {currentUser ? (
              <>
                <div className="px-4 pb-2 w-full max-w-xs">
                  <SearchBar />
                </div>
                
                <NavLink to="/feed" className="text-gray-300 hover:text-white transition text-lg" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={handleLinkClick}>Explore</NavLink>
                <NavLink to="/anonymous" className="text-gray-300 hover:text-white transition text-lg" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={handleLinkClick}>Anonymous🎭</NavLink>
                <NavLink to={`/profile/${currentUser._id}`} className="text-gray-300 hover:text-white transition text-lg" style={({ isActive }) => isActive ? activeLinkStyle : undefined} onClick={handleLinkClick}>My Profile</NavLink>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white transition text-lg"><FiLogOut /><span>Logout</span></button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition text-lg" onClick={handleLinkClick}>Sign In</Link>
                <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition text-lg" onClick={handleLinkClick}>Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;