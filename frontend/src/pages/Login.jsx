import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    emailOrAdmNo: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailOrAdmNo || !formData.password) {
      return setError('Please fill out all fields.');
    }
    setLoading(true);
    setError(null);
    try {
      await login(formData);
    
      setLoading(false);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome Back!</h1>
          <p className="text-center text-gray-300 mb-8">Sign in to continue to CampusHive</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiUser className="text-gray-300" /></div>
              <input type="text" id="emailOrAdmNo" placeholder="Email or Admission No." className="w-full pl-10 pr-3 py-2 text-white bg-white/20 rounded-lg border border-gray-400/50 focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring-1 transition duration-300 placeholder-gray-300" onChange={handleChange} />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiLock className="text-gray-300" /></div>
              <input type="password" id="password" placeholder="Password" className="w-full pl-10 pr-3 py-2 text-white bg-white/20 rounded-lg border border-gray-400/50 focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring-1 transition duration-300 placeholder-gray-300" onChange={handleChange} />
            </div>
            <button disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4">{loading ? 'Signing In...' : 'Sign In'}</button>
          </form>
          {error && <div className="mt-4 text-center bg-red-500/30 text-red-300 p-2 rounded-lg">{error}</div>}
          <div className="text-center mt-6"><p className="text-gray-400">Don't have an account?{' '}<Link to="/signup" className="font-semibold text-purple-400 hover:text-purple-300 transition">Sign Up</Link></p></div>
        </div>
      </div>
    </div>
  );
}

export default Login;