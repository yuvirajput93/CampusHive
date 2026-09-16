// src/components/ConfessionCard.jsx
import React, { useState } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

const ConfessionCard = ({ confession }) => {
    if (!confession) {
        return null;
    }
    const { currentUser } = useAuth();
    
    // State to manage likes
    const [likes, setLikes] = useState(confession.likes || []);
    const [isLiked, setIsLiked] = useState(() => {
        if (!currentUser) return false;
        return (confession.likes || []).includes(currentUser._id);
    });

    const handleLike = async () => {
        if(!currentUser) return;
        
        const originalLikes = [...likes];
        const newIsLiked = !isLiked;

        setIsLiked(newIsLiked);
        if (newIsLiked) {
            setLikes([...likes, currentUser._id]);
        } else {
            setLikes(likes.filter(id => id !== currentUser._id));
        }

        try{
            await apiClient.post(`/confessions/${confession._id}/like`);
        } catch(err){
            console.error("Failed to update like status:", err);
            setLikes(originalLikes);
            setIsLiked(!newIsLiked);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700 w-full max-w-2xl">
            <p className="text-gray-200 text-lg mb-4 whitespace-pre-wrap">
                {confession.content}
            </p>
            <div className="flex justify-between items-center text-gray-500">
                <span className="text-xs">
                    {new Date(confession.createdAt).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={handleLike} className="focus:outline-none">
                        <FiHeart 
                            className={`cursor-pointer transition-colors ${isLiked ? 'text-red-500 fill-current' : 'hover:text-red-500'}`} 
                        />
                    </button>
                    <span>{likes.length}</span>
                </div>
            </div>
        </div>
    );
};

export default ConfessionCard;