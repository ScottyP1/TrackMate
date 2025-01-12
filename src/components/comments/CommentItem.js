import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import ReplyForm from "./ReplyForm";
import axios from "axios";
import Cookies from "js-cookie";
import { FaTrash } from "react-icons/fa";

export default function CommentItem({ comment, userName, onCommentDelete }) {
    const [userHasLiked, setUserHasLiked] = useState(false);
    const [likes, setLikes] = useState(comment.likes || []);
    const [isDeleted, setIsDeleted] = useState(false);  // Track if the comment is deleted

    const userId = Cookies.get("userId"); // Get the logged-in user's userId

    useEffect(() => {
        if (userId) {
            const likesArray = comment.likes || [];
            setUserHasLiked(likesArray.some((like) => like.userId === userId));
        }
    }, [comment._id, userId]);

    // Handle like/unlike logic
    const handleLike = async () => {
        if (!userId) {
            alert("Please log in to like comments.");
            return;
        }

        const action = userHasLiked ? "unlike" : "like";

        try {
            await axios.put("/api/comments", { commentId: comment._id, userId, action });

            setLikes((prevLikes) =>
                action === "like"
                    ? [...prevLikes, { userId }]
                    : prevLikes.filter((like) => like.userId !== userId)
            );

            setUserHasLiked(!userHasLiked);
        } catch (error) {
            console.error("Error liking/unliking comment:", error);
        }
    };

    // Handle deleting the comment
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                const response = await axios.delete(`/api/comments?commentId=${comment._id}`);

                if (response.status === 200) {
                    setIsDeleted(true); // Mark the comment as deleted
                    if (onCommentDelete) {
                        onCommentDelete(comment._id); // Notify the parent component to remove the comment
                    }
                }
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    if (isDeleted) {
        return (
            <div className="bg-gray-700 p-3 sm:p-4 rounded-md shadow space-y-3">
                <p className="text-gray-300 text-sm sm:text-base">Comment deleted</p>
            </div>
        );
    }

    // Check if the current user owns the comment (userId should match the userId in cookies)
    const canDelete = comment.userId._id === userId;

    return (
        <div className="bg-gray-700 p-3 sm:p-4 rounded-md shadow space-y-3 relative">
            {/* Delete Button - only visible if the user is the comment owner */}
            {canDelete && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-600 transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none"
                    title="Delete Comment"
                    style={{ zIndex: 10 }} // Ensuring it's on top of other content
                >
                    <FaTrash className="text-lg sm:text-xl" />
                </button>
            )}

            {/* User Info */}
            <div className="flex items-center space-x-3">
                {comment.userId?.profileAvatar ? (
                    <img
                        src={comment.userId.profileAvatar} // Ensure this is populated
                        alt="User Avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-400 text-sm sm:text-lg" />
                    </div>
                )}
                <span className="font-semibold text-gray-200 text-sm sm:text-base">
                    {comment.userId?.name || "Anonymous"} {/* Display name or fallback */}
                </span>
            </div>

            {/* Comment Text */}
            <p className="text-gray-300 text-sm sm:text-base break-words">{comment.text}</p>

            {/* Like and Reply Actions */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 flex-wrap">
                <button
                    onClick={handleLike}
                    className={`font-medium ${userHasLiked ? "text-red-500" : "text-blue-400"} hover:underline`}
                >
                    {userHasLiked ? "Unlike" : "Like"} {likes.length}
                </button>

                <ReplyForm
                    commentId={comment._id}
                    replies={comment.replies || []}
                    userName={userName}
                />
            </div>
        </div>

    );
}
