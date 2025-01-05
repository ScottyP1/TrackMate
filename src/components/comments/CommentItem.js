'use client';

import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import ReplyForm from "./ReplyForm";
import axios from "axios";

export default function CommentItem({ comment, userName }) {
    const [userHasLiked, setUserHasLiked] = useState(false);
    const [likes, setLikes] = useState(comment.likes || []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (userId) {
            const likesArray = comment.likes || [];
            setUserHasLiked(likesArray.some((like) => like.toString() === userId));
        }
    }, [comment._id]);

    const handleLike = async () => {
        const userEmail = localStorage.getItem("userEmail");
        const userId = localStorage.getItem("userId");

        if (!userEmail) {
            alert("Please log in to like comments.");
            return;
        }

        const action = userHasLiked ? "unlike" : "like";

        try {
            await axios.put("/api/comments", { commentId: comment._id, userEmail, action });

            setLikes((prevLikes) =>
                action === "like"
                    ? [...prevLikes, userId]
                    : prevLikes.filter((id) => id !== userId)
            );

            setUserHasLiked(!userHasLiked);
        } catch (error) {
            console.error("Error liking/unliking comment:", error);
        }
    };

    return (
        <div className="bg-gray-700 p-3 sm:p-4 rounded-md shadow space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3">
                {comment.userId?.profileAvatar ? (
                    <img
                        src={comment.userId.profileAvatar} // Use the profileAvatar from populated userId
                        alt="User Avatar"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-400 text-sm sm:text-lg" />
                    </div>
                )}
                <span className="font-semibold text-gray-200 text-sm sm:text-base">
                    {comment.userId?.name || "Anonymous"}
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
