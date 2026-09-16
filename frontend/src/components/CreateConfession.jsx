// src/components/CreateConfession.jsx
import React, { useState } from 'react';
import apiClient from '../api/axios';

const CreateConfession = ({ onConfessionPosted }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() === '') {
            setError('Confession cannot be empty.');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const response = await apiClient.post('/confessions', { content });
            onConfessionPosted(response.data.data);
            setContent('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post confession.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-800/60 backdrop-blur-lg rounded-xl shadow-md p-4 border border-gray-700">
                <textarea
                    className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-600 focus:outline-none focus:border-purple-400 resize-none"
                    rows="4"
                    placeholder="Write your confession here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={500}
                />
                <div className="flex justify-between items-center mt-3">
                    <span className="text-gray-500 text-sm">{content.length}/500</span>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                        {submitting ? "Posting..." : "Post Confession"}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default CreateConfession;