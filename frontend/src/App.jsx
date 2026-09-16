import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import ProtectedRoute from './components/ProtectedRoute';
import apiClient from './api/axios';
import UserProfile from './pages/UserProfile';
import CheckEmail from './pages/CheckEmail';
import VerifyEmail from './pages/VerifyEmail';
import AnonymousPage from './pages/AnonymousPage';

function App() {

  useEffect(() => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.classList.add('hidden');
    }

    const wakeUpServer = async () => {
      try {
        await apiClient.get('/health');
      } catch (e) {
        // This request is only to wake the server, errors can be ignored.
      }
    };
    wakeUpServer();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/check-your-email" element={<CheckEmail />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/anonymous" element={<AnonymousPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;