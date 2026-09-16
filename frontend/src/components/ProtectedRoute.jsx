import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="pt-24 text-center text-gray-400">
        Authenticating...
      </div>
    );
  }
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;