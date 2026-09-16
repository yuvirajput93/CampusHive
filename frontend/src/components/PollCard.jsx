// src/components/PollCard.jsx
import React, { useState, useMemo } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

const PollCard = ({ poll, onPollDeleted }) => {
    const { currentUser } = useAuth();
    // Use an internal state for poll data to ensure the card can update itself.
    const [pollData, setPollData] = useState(poll);

    const { userVote, totalVotes } = useMemo(() => {
        let userVote = null;
        let totalVotes = 0;
        if (pollData && pollData.options) {
            for (const option of pollData.options) {
                totalVotes += option.votes.length;
                if (currentUser && option.votes.includes(currentUser._id)) {
                    userVote = option._id;
                }
            }
        }
        return { userVote, totalVotes };
    }, [pollData, currentUser]);

    const handleVote = async (optionId) => {
        try {
            const response = await apiClient.post(`/polls/${pollData._id}/vote/${optionId}`);
            // This is the crucial step: update the card's own state with fresh data from the server.
            setPollData(response.data.data); 
        } catch (error) {
            console.error("Failed to vote:", error.response?.data?.message || error.message);
        }
    };
    
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this poll?")) {
            try {
                await apiClient.delete(`/polls/${pollData._id}`);
                onPollDeleted(pollData._id);
            } catch (error) {
                console.error("Failed to delete poll:", error);
            }
        }
    };

    if (!pollData || !pollData.createdBy) {
        return null;
    }

    const isOwner = currentUser?._id === pollData.createdBy._id;
    const formattedDate = new Date(pollData.createdAt).toLocaleString();

    return (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700 w-full max-w-2xl">
            <div className="flex justify-between items-start">
                <p className="text-gray-200 text-lg mb-4">{pollData.question}</p>
                {isOwner && (
                    <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500">
                        <FiTrash2 />
                    </button>
                )}
            </div>
            
            <div className="space-y-3">
                {pollData.options.map((option) => {
                    const votePercentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                    
                    return (
                        <div key={option._id}>
                            <button
                                onClick={() => handleVote(option._id)}
                                className="w-full text-left p-3 rounded-lg border-2 border-gray-600 hover:bg-gray-700 hover:border-purple-500 transition relative overflow-hidden"
                            >
                                {userVote && (
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-purple-600/20 rounded-md transition-all duration-500" 
                                        style={{ width: `${votePercentage}%` }}
                                    ></div>
                                )}

                                <div className="flex justify-between items-center z-10 relative">
                                    <span className={option._id === userVote ? 'text-purple-400 font-bold' : 'text-white'}>
                                        {option.text}
                                    </span>
                                    {userVote && <span className="text-gray-400 text-sm font-semibold">{votePercentage.toFixed(0)}%</span>}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center text-gray-500 mt-4 text-xs">
                <span>{totalVotes} votes</span>
                <span>{formattedDate}</span>
            </div>
        </div>
    );
};

export default PollCard;