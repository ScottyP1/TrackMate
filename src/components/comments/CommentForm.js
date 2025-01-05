'use client';
import { useState } from "react";
import axiosInstance from "@/api/axios";
import { FaUserCircle } from "react-icons/fa"; // User icon library

export default function CommentForm({ trackId, onCommentSubmit }) {
    const [commentText, setCommentText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');

        if (!token || !userEmail) {
            setErrorMessage('You must be logged in to comment.');
            return;
        }

        try {
            const response = await axiosInstance.post('/comments', { text: commentText, trackId, userEmail });
            setCommentText('');
            setErrorMessage('');
            setShowForm(false); // Hide form after submitting
            onCommentSubmit(response.data);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <div>
            {!showForm && (
                <button
                    className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50"
                    onClick={() => setShowForm(true)}
                >
                    +
                </button>
            )}
            {showForm && (
                <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 m-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex flex-col items-center">
                            {/* User Icon */}
                            <FaUserCircle className="text-blue-500 text-4xl mb-4" />
                            <p className="text-gray-700 font-medium mb-4">
                                Leave your comment below
                            </p>
                        </div>
                        {errorMessage && <p className="text-red-400">{errorMessage}</p>}
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                className="w-full rounded-lg p-2 text-black mt-2"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write your comment..."
                            />
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                                    type="submit"
                                >
                                    Submit
                                </button>
                                <button
                                    className="bg-gray-500 text-white rounded-lg px-4 py-2"
                                    onClick={() => setShowForm(false)}
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
