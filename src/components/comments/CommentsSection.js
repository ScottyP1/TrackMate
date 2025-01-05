'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import CommentItem from "./CommentItem";

export default function CommentsSection({ trackId }) {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        setComments([]);
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments?trackId=${trackId}`);
                setComments(response.data.comments);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();

        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, [trackId]);

    const handleCommentSubmit = async () => {
        if (!newCommentText.trim()) return;

        const userEmail = localStorage.getItem("userEmail");

        if (!userEmail) {
            alert("Please log in first.");
            return;
        }

        try {
            const response = await axios.post("/api/comments", {
                text: newCommentText,
                trackId,
                userEmail,
                name: userName,
            });

            if (response.status === 201) {
                setNewCommentText("");
                setComments((prevComments) => [response.data, ...prevComments]);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-md shadow-md space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-200">Comments</h2>

            {/* Comment Form */}
            <div className="flex flex-col space-y-2">
                <textarea
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="p-3 bg-gray-700 text-gray-200 rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 min-h-[80px] text-sm sm:text-base"
                />
                <button
                    onClick={handleCommentSubmit}
                    className="self-end px-3 sm:px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 text-sm sm:text-base"
                >
                    Submit
                </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            userName={userName}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 text-sm sm:text-base">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}
