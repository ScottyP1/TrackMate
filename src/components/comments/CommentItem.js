'use client'
import { FaTrash } from 'react-icons/fa';
import { useContext, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { format } from 'date-fns';

import { Context as CommentContext } from '@/context/CommentContext';
import { Context as AuthContext } from '@/context/AuthContext';
import ReplyForm from '@/components/comments/ReplyForm';
import ReplyItem from '@/components/comments/ReplyItem';

export default function CommentItem({ comment }) {
    // const [showReplyForm, setShowReplyForm] = useState(false);
    // const [showReplies, setShowReplies] = useState(false);
    const { fetchComments, likeComment, deleteComment } = useContext(CommentContext);
    const { state } = useContext(AuthContext);

    const token = Cookies.get('authToken');

    // const handleLike = async () => {
    //     if (!token) {
    //         alert('Please log in to like comments.');
    //         return;
    //     }
    //     await likeComment(comment._id, state.user.id);
    // };

    // const handleReplyClick = () => {
    //     setShowReplyForm((prev) => !prev);
    // };

    // const handleCommentsClick = () => {
    //     setShowReplies((prev) => !prev);
    // };

    const handleDeleteClick = async () => {
        await deleteComment(comment._id);
    };

    return (
        <div className="p-2 border-2 bg-black/[.5] shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-4">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                    {/* User Avatar */}
                    <Link href={`/Account/${comment.userId._id}`}>
                        <img
                            src={comment.userId.profileAvatar || '/default-avatar.png'}
                            alt="User Avatar"
                            className="w-[30px] h-[30px] md:w-10 md:h-10 rounded-full border-2 border-blue-500"
                        />
                    </Link>

                    {/* Date and Name */}
                    <div>
                        {/* Date */}
                        <small className="block text-gray-400">
                            {format(new Date(comment.createdAt), 'MM/dd/yyyy')}
                        </small>

                        {/* Name */}
                        <span className="text-white text-sm font-semibold">
                            {comment.userId?.name || 'Anonymous'}
                        </span>
                    </div>
                </div>


                {/* Trash Icon */}
                {state.user?.id === comment.userId?._id && (
                    <button
                        className="text-red-500 hover:text-red-700 transition-all duration-300"
                        onClick={handleDeleteClick}
                    >
                        <FaTrash className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Comment Text */}
            <p className="text-white text-lg mb-4">{comment.text}</p>

            {/* Like and Reply Section */}
            {/* <div className="flex justify-between items-center text-white space-x-4">
                <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 hover:underline focus:outline-none transition-all duration-300"
                >
                    <span>{comment.likes.length} Likes</span>
                </button> */}

            {/* <button
                    onClick={handleCommentsClick}
                    className="flex items-center space-x-2 hover:underline focus:outline-none transition-all duration-300"
                >
                    <span>{comment.replies.length} Comments</span>
                </button> */}

            {/* <button
                    onClick={handleReplyClick}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                    {showReplyForm ? 'Cancel Reply' : 'Reply'}
                </button> */}
            {/* </div> */}

            {/* Replies Section */}
            {/* {showReplies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                        <ReplyItem
                            key={reply._id}
                            reply={reply}
                            currentUserId={state.user.id}
                            onDelete={() => deleteComment(reply._id)}
                        />
                    ))}
                </div>
            )} */}

            {/* Reply Form */}
            {/* {showReplyForm && <ReplyForm commentId={comment._id} />} */}
        </div>
    );
}
