import React, { useState, useEffect } from "react";
import apiClient from '../api/axios';
import { FiTrash2} from 'react-icons/fi';
import { FaPaperPlane } from "react-icons/fa";

function Comment({ postId, currentUser }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/posts/${postId}/comments`);
                setComments(response.data.data);
            } catch (err) {
                console.error("failed to fetch comments", err);
            } finally {
                setLoading(false);
            }
        };
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) {
            alert('Please enter a comment');
            return;
        }
        try {
            const response = await apiClient.post(`/posts/${postId}/comments`, { text });
            setComments([response.data.data, ...comments]);
            setText('');
        } catch (err) {
            console.error("failed to create comment", err);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }
        try {
            await apiClient.delete(`/comments/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (err) {
            console.error("failed to delete comment", err);
        }
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
            
            {currentUser && (
                <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-6">
                    <textarea
                        placeholder="Add a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        rows="1"
                        required
                    />
                    <button 
                      type="submit"
                      className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors shrink-0 flex items-center justify-center"
                    >
                      <FaPaperPlane className="h-5 w-5" />
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {loading ? (
                    <p className="text-gray-400">Loading comments...</p>
                ) : comments.length > 0 ? (
                    comments.map(comment => {
                      const isOwner = currentUser?._id === comment.createdBy?._id;
                      return (
                          <div key={comment._id} className="flex items-start gap-3">
                              <img
                                  src={comment.createdBy?.profilePic || `https://ui-avatars.com/api/?name=${comment.createdBy?.firstName}+${comment.createdBy?.lastName || ''}&background=4f46e5&color=fff`}
                                  alt="author"
                                  className="h-9 w-9 rounded-full object-cover shrink-0"
                              />
                              <div className="flex-grow bg-gray-700/50 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                      <p className="font-bold text-sm text-white">
                                          {`${comment.createdBy?.firstName || ''} ${comment.createdBy?.lastName || ''}`.trim() || 'User'}
                                      </p>
                                      {isOwner && (
                                          <button 
                                            onClick={() => handleDelete(comment._id)} 
                                            className="text-gray-400 hover:text-red-500"
                                            aria-label="Delete comment"
                                        >
                                            <FiTrash2 size={16} />
                                          </button>
                                      )}
                                  </div>
                                  <p className="text-gray-300 mt-1">{comment.text}</p>
                              </div>
                          </div>
                      );
                  })
                ) : (
                    <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default Comment;