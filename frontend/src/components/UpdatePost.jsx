import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSave, FiImage, FiTrash2 } from 'react-icons/fi';
import apiClient from '../api/axios';

function UpdatePost({ post, onUpdate, onClose }) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null); 
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  
  useEffect(() => {
    if (post) {
      setContent(post.content || '');
      setPreview(post.image || null);
      setImageFile(null); 
    }
  }, [post]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview(null);
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !preview) return;

    setLoading(true);

    
    const formData = new FormData();
    formData.append('content', content);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    // If the user wants to remove the image, we can send a special signal
    // This depends on your backend API design. A common way is to send an empty value.
    else if (!preview && post.image) {
        formData.append('image', '');
    }


    try {
      const response = await apiClient.patch(`/posts/${post._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpdate(response.data.data);
      onClose();

    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full">
          <textarea
            className="w-full bg-gray-900 text-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none p-3 rounded-md"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* --- NEW IMAGE PREVIEW & CONTROLS --- */}
          {preview && (
            <div className="mt-4 relative">
              <img src={preview} alt="Post preview" className="rounded-lg max-h-80 w-auto" />
              <button 
                type="button" 
                onClick={handleRemoveImage} 
                className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black"
                aria-label="Remove image"
              >
                <FiTrash2 size={18}/>
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div>
              <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} hidden />
              <button 
                type="button" 
                onClick={() => imageInputRef.current.click()} 
                className="text-purple-400 hover:text-purple-300 p-2 rounded-full flex items-center gap-2"
                aria-label="Change image"
              >
                <FiImage size={24} /> 
                <span className='text-sm font-semibold'>{preview ? "Change Image" : "Add Image"}</span>
              </button>
            </div>
            <div className="flex items-center">
              <button type="button" onClick={onClose} className="text-gray-300 font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 mr-2 sm:mr-4">
                Cancel
              </button>
              <button type="submit" disabled={loading || (!content && !preview)} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <FiSave />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePost;