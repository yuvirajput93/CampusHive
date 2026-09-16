import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axios";

const FollowButton = ({ profileUser, onFollowStateChange }) => {
    const { currentUser, setCurrentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollower, setIsFollower] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentUser && profileUser) {
            setIsFollowing(currentUser.following.includes(profileUser._id));
            setIsFollower(profileUser.following.includes(currentUser._id));
        }
    }, [profileUser, currentUser]);
    

    const handleFollowToggle = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                await apiClient.post(`/user/unfollow/${profileUser._id}`);
                onFollowStateChange(!isFollowing);
                setIsFollowing(prev => !prev);
                setCurrentUser(prev => ({
                    ...prev,
                    following: prev.following.filter(id => id !== profileUser._id)
                }));
            } else {
                await apiClient.post(`/user/follow/${profileUser._id}`);
                onFollowStateChange(!isFollowing);
                setIsFollowing(prev => !prev);
                setCurrentUser(prev => ({
                    ...prev,
                    following: [...prev.following, profileUser._id]
                }));
            }
        } catch (err) {
            console.error("Error toggling follow status:", err);
            setError("Failed to update follow status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser || !profileUser || currentUser._id === profileUser._id) {
        return null;
    }

    const buttonText = isFollowing ? 'Following' : (isFollower ? 'Follow Back' : 'Follow');
    const buttonStyle = isFollowing
        ? 'bg-gray-700 text-white hover:bg-gray-600'
        : 'bg-purple-600 text-white hover:bg-purple-700';

    return (
        <button
            onClick={handleFollowToggle}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${buttonStyle} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {buttonText}
        </button>
    );
};

export default FollowButton;