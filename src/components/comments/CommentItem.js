import { FaTrash } from 'react-icons/fa';
import { useContext, useState } from 'react';
import { Context as CommentContext } from '@/context/CommentContext';
import { Context as AuthContext } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function CommentItem({ comment }) {
    const { likeComment, deleteComment } = useContext(CommentContext);  // Add deleteComment
    const { state } = useContext(AuthContext);

    const token = Cookies.get('authToken');

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleLike = async () => {
        if (!token) {
            alert('Please log in to like comments.');
            return;
        }
        await likeComment(comment._id, state.user.id);
    };

    const handleReplyClick = () => {
        setShowReplyForm((prev) => !prev); // Toggle the reply form visibility
    };

    const handleCommentsClick = () => {
        setShowReplies((prev) => !prev); // Toggle the visibility of the replies
    };

    const handleDeleteClick = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            await deleteComment(comment._id);  // Call the delete action
        }
    };

    return (
        <div className="p-6 bg-black/[.6] shadow-lg rounded-xl mb-6">
            <div className="flex justify-between items-center mb-4">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                    <Link href={`/Account/${comment.userId._id}`}> {/* Add Link to user's profile */}
                        <img
                            src={comment.userId.profileAvatar || '/default-avatar.png'}
                            alt="User Avatar"
                            className="w-[60px] h-[60px] md:w-20 md:h-20 rounded-full border-2 border-blue-500"
                        />
                    </Link>
                    <span className="text-white text-xl font-semibold">
                        {comment.userId?.name || 'Anonymous'}
                    </span>
                </div>

                {/* Trash Icon (Optional, show if user is the comment author) */}
                {state.user.id === comment.userId?._id && (
                    <button
                        className="text-red-500 hover:text-red-700 transition-all duration-300"
                        onClick={handleDeleteClick} // Call delete function on click
                    >
                        <FaTrash className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Comment Text */}
            <p className="text-white text-lg mb-4">{comment.text}</p>

            {/* Like and Reply Section */}
            <div className="flex justify-between items-center text-blue-500 space-x-4">
                {/* Like Button */}
                <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 hover:underline focus:outline-none transition-all duration-300"
                >
                    <span>{comment.likes.length} Likes</span>
                </button>

                {/* Comments Button */}
                <button
                    onClick={handleCommentsClick}
                    className="flex items-center space-x-2 hover:underline focus:outline-none transition-all duration-300"
                >
                    <span>{comment.replies.length} Comments</span>
                </button>

                {/* Reply Button */}
                <button
                    onClick={handleReplyClick}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                    {showReplyForm ? 'Cancel Reply' : 'Reply'}
                </button>
            </div>

            {/* Show the Replies Section */}
            {showReplies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map((reply, index) => (
                        <div className="flex items-center space-x-4" key={index}>
                            <div>
                                <img
                                    src={reply.userId.profileAvatar || '/default-avatar.png'}
                                    alt="User Avatar"
                                    className="w-[60px] h-[60px] md:w-20 md:h-20 rounded-full border-2 border-blue-500"
                                />
                                <span className="text-white text-xl font-semibold">
                                    {reply.userId?.name || 'Anonymous'}
                                </span>
                            </div>
                            <div>
                                <span>{reply.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Show the Reply Form if toggled */}
            {showReplyForm && <ReplyForm commentId={comment._id} />}
        </div>
    );
}
