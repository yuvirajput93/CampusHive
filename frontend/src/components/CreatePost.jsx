import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiImage, FiSend } from 'react-icons/fi';
import apiClient from '../api/axios';

function CreatePost({ onPostCreated }) {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  
  if (!currentUser) {
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !imageFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // 2. Use the new apiClient
      const response = await apiClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onPostCreated(response.data.data); 
      
      setContent('');
      setImageFile(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-8">
      <div className="flex items-start gap-4">
        <img src={currentUser.profilePic || `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}&background=4f46e5&color=fff`} alt="profile" className="h-12 w-12 rounded-full object-cover" />
        <form onSubmit={handleSubmit} className="w-full">
          <textarea className="w-full bg-transparent text-lg text-gray-200 placeholder-gray-400 focus:outline-none resize-none" rows="3" placeholder={`What's on your mind, ${currentUser.firstName}?`} value={content} onChange={(e) => setContent(e.target.value)} />
          {preview && <div className="mt-4 relative"><img src={preview} alt="Preview" className="rounded-lg max-h-80 w-auto" /><button type="button" onClick={() => { setPreview(null); setImageFile(null); }} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">&times;</button></div>}
          <div className="flex justify-between items-center mt-4">
            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} hidden />
            <button type="button" onClick={() => imageInputRef.current.click()} className="text-purple-400 hover:text-purple-300 p-2 rounded-full"><FiImage size={24} /></button>
            <button type="submit" disabled={loading || (!content && !imageFile)} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"><FiSend /><span>{loading ? 'Posting...' : 'Post'}</span></button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
