'use client';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Context as CommentContext } from '@/context/CommentContext';
import { Context as AuthContext } from '@/context/AuthContext';
import CommentItem from './CommentItem';
import Cookies from 'js-cookie';

export default function CommentsSection({ trackId }) {
    const { state, fetchComments, addComment } = useContext(CommentContext);
    const { state: AuthState } = useContext(AuthContext);

    const [newCommentText, setNewCommentText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch comments when the component is mounted or the trackId changes
    useEffect(() => {
        fetchComments(trackId); // Fetch comments for the current trackId
    }, [trackId, state.comments.length]); // Only re-run when trackId changes

    const handleCommentSubmit = () => {
        const token = Cookies.get('authToken');
        if (!token) {
            setErrorMessage('You must be logged in to comment.');
            return;
        }

        if (!newCommentText.trim()) return;

        // Call the addComment action to update the state
        addComment(trackId, newCommentText, AuthState.user.id);
        setNewCommentText('');
        setErrorMessage('');
    };


    // Ensure state.comments is always an array before mapping over it
    const comments = Array.isArray(state.comments) ? state.comments : [];

    return (
        <div className="max-w-6xl mx-auto p-6 bg-black/[.6] shadow-2xl rounded-xl text-white mt-12 mb-8">
            {/* Comment Text Area */}
            <div className="mb-6">
                <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full h-32 p-4 bg-transparent border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-blue-300 transition-all duration-300"
                />
            </div>

            {/* Error and Submit Button */}
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            <button
                onClick={handleCommentSubmit}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all focus:ring-2 focus:ring-blue-500"
            >
                Submit Comment
            </button>

            {/* Loading & Error States */}
            {state.loading && <p className="text-center text-blue-300 mt-4">Loading comments...</p>}
            {state.errorMessage && <p className="text-center text-red-500 mt-4">{state.errorMessage}</p>}

            {/* Comment List */}
            <div className="mt-8 space-y-6">
                {comments.length > 0 ? (
                    comments.map((comment, index) => {
                        // Make sure comment is not undefined and has an _id
                        if (!comment || !comment._id) {
                            console.warn(`Comment at index ${index} is missing _id`, comment);
                            return null; // Skip rendering this comment
                        }
                        return <CommentItem key={comment._id} comment={comment} />;
                    })
                ) : (
                    <p className="text-center text-blue-200">No comments yet.</p>
                )}
            </div>

        </div>
    );
}
