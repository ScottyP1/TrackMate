'use client';
import { useState, useContext } from 'react';
import { Context as CommentContext } from '@/context/CommentContext';
import Cookies from 'js-cookie';

export default function ReplyForm({ commentId }) {
    const [replyText, setReplyText] = useState('');
    const { addReply } = useContext(CommentContext);

    const handleReplySubmit = async () => {
        const userEmail = Cookies.get('userEmail');
        if (!userEmail) {
            alert('Please log in to reply.');
            return;
        }

        if (!replyText.trim()) return;

        // Add the reply
        await addReply(commentId, replyText, userEmail);
        setReplyText('');
    };

    return (
        <div className="bg-black/[.6] p-6 rounded-xl shadow-lg mb-4">
            {/* Reply Input */}
            <div className="mb-4">
                <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-4 bg-black/[.5] text-white rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
            </div>

            {/* Submit Reply Button */}
            <button
                onClick={handleReplySubmit}
                className="w-full py-2 px-6 bg-gradient-to-b from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
            >
                Submit Reply
            </button>
        </div>
    );
}
