import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext();


export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Use apiClient to check the session, it will handle cookies automatically
        const response = await apiClient.get('/user/currentuser');
        setCurrentUser(response.data.data);
      } catch (error) {
        // If the request fails (e.g., 401), it means no valid session
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []); 

  const login = async (credentials) => {
    const response = await apiClient.post('/user/login', credentials);
    setCurrentUser(response.data.data);
    return response;
  };

  const logout = async () => {
    await apiClient.post('/user/logout');
    setCurrentUser(null);
  };

  // The value provided to the rest of the app
  const value = {
    currentUser,
    loading,
    login, 
    logout,  
    setCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};