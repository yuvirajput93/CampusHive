import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setResults([]);
        setQuery('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const debounceTimer = setTimeout(() => {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const response = await apiClient.get(`/user/search?q=${query}`);
          setResults(response.data.data);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUsers();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(`/profile/${results[0]._id}`);
      handleLinkClick();
    }
  };
  
  const handleKeyDown = (e) => {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        e.preventDefault();
        navigate(`/profile/${results[activeIndex]._id}`);
        handleLinkClick();
      }
      // If no item is highlighted, the form's onSubmit will handle it
    }
  };

  const handleLinkClick = () => {
    setQuery('');
    setResults([]);
    setActiveIndex(-1);
  };

  return (
    <div ref={searchContainerRef} className="relative w-64">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search users..."
          className="w-full px-4 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </form>

      {query && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
          {isLoading ? (
            <div className="p-4 text-gray-400">Searching...</div>
          ) : results.length > 0 ? (
            results.map((user, index) => (
              <Link
                key={user._id}
                to={`/profile/${user._id}`}
                onClick={handleLinkClick}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center gap-3 p-3 transition-colors ${
                  index === activeIndex ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <img
                  src={user.profilePic || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=4f46e5&color=fff`}
                  alt={user.firstName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="text-white font-medium">{user.firstName} {user.lastName}</span>
              </Link>
            ))
          ) : (
            <div className="p-4 text-gray-400">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;