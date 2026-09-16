import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axios';
import FollowButton from '../components/FollowButton';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() =>{
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/user/${id}`);
                if (response.data && response.data.data) {
                    setUser(response.data.data);
                }
            } catch (e) {
                setError('failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id]);

    const handleFollowStateChange = (didFollow) => {
        if (!user || !currentUser) return;

        setUser(prevUser => {
            const currentFollowers = prevUser.followers;
            const updatedFollowers = didFollow
                ? [...currentFollowers, currentUser._id]
                : currentFollowers.filter(followerId => followerId !== currentUser._id);

            return { ...prevUser, followers: updatedFollowers };
        });
    };

    if (loading) {
        return <div className="text-xl text-center pt-28">Loading Profile...</div>;
    }
    if (error) {
        return <div className="text-xl text-red-500 text-center pt-28">{error}</div>;
    }
    if (!user) {
        return <div className="text-xl text-center pt-28">User not found.</div>
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden mx-auto mt-28">
                <div className="h-40 bg-gradient-to-r from-cyan-600 to-blue-700"></div>

                <div className="px-8 pb-6 text-center">
                    <img
                        src={user.profilePic || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff&size=150`}
                        alt={`${user.firstName}'s profile`}
                        className="w-40 h-40 rounded-full border-4 border-gray-800 mx-auto -mt-24 object-cover"
                    />
                    <div className="mt-4">
                        <h1 className="text-4xl font-bold text-white">{`${user.firstName} ${user.lastName || ''}`}</h1>
                        <p className="text-md text-gray-400 mt-1">@{user.admNo}</p>
                    </div>
                </div>
                
                <div className="px-8 pb-6 flex justify-center items-center gap-8 border-b border-gray-700">
                    <div className="text-center">
                        <p className="text-2xl font-bold">{user.followers.length}</p>
                        <p className="text-sm text-gray-400">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold">{user.following.length}</p>
                        <p className="text-sm text-gray-400">Following</p>
                    </div>
                    <div className="ml-4">
                        <FollowButton profileUser={user} onFollowStateChange={handleFollowStateChange} />
                    </div>
                </div>

                <div className="p-8 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Discipline</h3>
                            <p className="text-lg text-gray-200 mt-1">{user.discipline}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Branch</h3>
                            <p className="text-lg text-gray-200 mt-1">{user.branch}</p>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Email</h3>
                            <p className="text-lg text-gray-200 mt-1">{user.email}</p>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Member Since</h3>
                            <p className="text-lg text-gray-200 mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;