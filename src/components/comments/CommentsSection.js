import { useState, useEffect } from "react";
import axios from "axios";
import CommentItem from "./CommentItem";
import Cookies from "js-cookie";

export default function CommentsSection({ trackId }) {
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");
    const [userName, setUserName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch comments when trackId changes
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/comments?trackId=${trackId}`);
                setComments(response.data.comments);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();

        const storedName = Cookies.get("name");
        if (storedName) {
            setUserName(storedName);
        }
    }, [trackId]);

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (!newCommentText.trim()) return;

        const userEmail = Cookies.get("userEmail");

        if (!userEmail) {
            setErrorMessage("You must be logged in to comment.");
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
                // Add the new comment to the state (it should have populated user data)
                setComments((prevComments) => [response.data, ...prevComments]);
                setErrorMessage(""); // Clear error message
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
            setErrorMessage("An error occurred while submitting your comment.");
        }
    };

    // Handle comment deletion
    const handleCommentDelete = async (deletedCommentId) => {
        try {
            // First, filter out the deleted comment from the local state
            setComments((prevComments) =>
                prevComments.filter((comment) => comment._id !== deletedCommentId)
            );

            // Optionally, refetch the comments from the backend to sync the state
            const response = await axios.get(`/api/comments?trackId=${trackId}`);
            setComments(response.data.comments);  // Update the state with the latest comments

        } catch (error) {
            console.error("Error fetching comments after deletion:", error);
            // Optionally handle the error if the refetch fails
        }
    };

    return (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-md shadow-md space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-200">Comments</h2>

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-500 text-white p-2 rounded-md text-sm">
                    {errorMessage}
                </div>
            )}

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
                    className="self-end bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-full md:w-[100px] h-[48px] rounded-lg p-3 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-80"
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
                            onCommentDelete={handleCommentDelete} // Pass delete handler here
                        />
                    ))
                ) : (
                    <p className="text-gray-400 text-sm sm:text-base">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}
