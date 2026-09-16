import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBookOpen, FiGitBranch, FiAward, FiCamera } from 'react-icons/fi';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';

const InputField = ({ id, type, placeholder, icon, value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full pl-10 pr-3 py-2 text-white bg-white/20 rounded-lg border border-gray-400/50 focus:border-purple-400 focus:ring-purple-400 focus:outline-none focus:ring-1 transition duration-300 placeholder-gray-300"
      onChange={onChange}
      value={value}
      required={id !== 'lastName'}
    />
  </div>
);


function SignUp() {
  const [formData, setFormData] = useState({
    admNo: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    discipline: '',
    branch: '',
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from our context

  useEffect(() => {
    if (imageFile) {
      const newUrl = URL.createObjectURL(imageFile);
      setImageFileUrl(newUrl);
      return () => URL.revokeObjectURL(newUrl);
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    setError(null);
    
    const submissionData = new FormData();
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    if (imageFile) {
      submissionData.append('profilePic', imageFile);
    }

    try {
      // Step 1: Create the user account
      await apiClient.post('/user/signup', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      setLoading(false);
      navigate('/check-your-email');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-center text-white mb-2">Join CampusHive</h1>
          <p className="text-center text-gray-300 mb-6">Create your student account</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex justify-center mb-4">
              <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} hidden />
              <div className="relative w-24 h-24 rounded-full cursor-pointer group bg-gray-700 border-2 border-gray-600 group-hover:border-purple-400 transition" onClick={() => fileInputRef.current.click()}>
                {imageFileUrl ? <img src={imageFileUrl} alt="Profile Preview" className="w-full h-full rounded-full object-cover" /> : <div className="w-full h-full rounded-full flex items-center justify-center"><FiUser className="w-10 h-10 text-gray-400" /></div>}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><FiCamera className="text-white w-6 h-6" /></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <InputField 
                  id="firstName" 
                  type="text" 
                  placeholder="First Name" 
                  icon={<FiUser className="text-gray-300" />} 
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <InputField 
                  id="lastName" 
                  type="text" 
                  placeholder="Last Name (Optional)" 
                  icon={<FiUser className="text-gray-300" />}
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <InputField id="admNo" type="text" placeholder="Admission No." icon={<FiAward className="text-gray-300" />} value={formData.admNo} onChange={handleChange} />
            <InputField id="email" type="email" placeholder="Email" icon={<FiMail className="text-gray-300" />} value={formData.email} onChange={handleChange} />
            <InputField id="password" type="password" placeholder="Password" icon={<FiLock className="text-gray-300" />} value={formData.password} onChange={handleChange} />
            <InputField id="discipline" type="text" placeholder="Discipline (e.g., B.Tech)" icon={<FiBookOpen className="text-gray-300" />} value={formData.discipline} onChange={handleChange} />
            <InputField id="branch" type="text" placeholder="Branch (e.g., CSE)" icon={<FiGitBranch className="text-gray-300" />} value={formData.branch} onChange={handleChange} />
            <button disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4">{loading ? 'Creating Account...' : 'Sign Up'}</button>
          </form>
          {error && <div className="mt-4 text-center bg-red-500/30 text-red-300 p-2 rounded-lg">{error}</div>}
          <div className="text-center mt-6"><p className="text-gray-400">Already have an account?{' '}<Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition">Sign In</Link></p></div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;