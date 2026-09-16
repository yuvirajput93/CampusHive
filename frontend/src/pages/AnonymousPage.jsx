// src/pages/AnonymousPage.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import ConfessionCard from "../components/ConfessionCard";
import CreateConfession from "../components/CreateConfession";
import CreatePoll from "../components/CreatePoll";
import PollCard from "../components/PollCard";

const AnonymousPage = () => {
    const [activeTab, setActiveTab] = useState('confessions');
    const [confessions, setConfessions] = useState([]);
    const [loadingConfessions, setLoadingConfessions] = useState(true);
    const [error, setError] = useState(null);
    const [polls, setPolls] = useState([]);
    const [loadingPolls, setLoadingPolls] = useState(true);

    const fetchConfessions = async () => {
        try {
            setLoadingConfessions(true);
            const response = await apiClient.get("/confessions");
            setConfessions(response.data.data);
        } catch (err) {
            setError("Failed to fetch confessions");
        } finally {
            setLoadingConfessions(false);
        }
    };

    const handleConfessionPosted = (newConfession) => {
        setConfessions([newConfession, ...confessions]);
    };
    const handlePollCreated = (newPoll) => {
        setPolls([newPoll, ...polls]);
    }

    const fetchPolls = async () => {
        try {
            setLoadingPolls(true);
            const response = await apiClient.get("/polls");
            setPolls(response.data.data);
        } catch (err) {
            setError("Failed to fetch polls");
        } finally {
            setLoadingPolls(false);
        }
    };

    const handlePollDeleted = (deletedPollId) => {
        setPolls(polls.filter(poll => poll._id !== deletedPollId));
    };

    useEffect(() => {
        if (activeTab === 'confessions') {
            fetchConfessions();
        } else if (activeTab === 'polls') {
            fetchPolls();
        }
    }, [activeTab]);

    return (
        <div className="container mx-auto p-4 pt-24">
            <div className="flex justify-center mb-8 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('confessions')}
                    className={`px-6 py-3 text-lg font-semibold transition ${activeTab === 'confessions' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
                >
                    Confessions
                </button>
                <button
                    onClick={() => setActiveTab('polls')}
                    className={`px-6 py-3 text-lg font-semibold transition ${activeTab === 'polls' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
                >
                    Polls
                </button>
            </div>

            {activeTab === 'confessions' && (
                <>
                    <div className="mb-8">
                        <CreateConfession onConfessionPosted={handleConfessionPosted} />
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        {loadingConfessions ? (
                            <p>Loading confessions...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : confessions.length > 0 ? (
                            confessions.map((confession) => (
                                <ConfessionCard key={confession._id} confession={confession} />
                            ))
                        ) : (
                            <p>No confessions yet. Be the first to share!</p>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'polls' && (
                <>
                    <div className="mb-8">
                        <CreatePoll onPollCreated={handlePollCreated} />
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        {loadingPolls ? (
                            <p>Loading polls...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : polls.length > 0 ? (
                            polls.map((poll) => (
                                <PollCard 
                                    key={poll._id} 
                                    poll={poll} 
                                    onPollDeleted={handlePollDeleted} 
                                />
                            ))
                        ) : (
                            <p>No polls yet. Be the first to create one!</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AnonymousPage;