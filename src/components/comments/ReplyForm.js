import { useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import Cookies from "js-cookie";

export default function ReplyForm({ commentId, replies, userName }) {
    const [isReplying, setIsReplying] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [currentReplies, setCurrentReplies] = useState(replies);

    const handleReplySubmit = async () => {
        if (!replyText.trim()) return;
        const userEmail = Cookies.get("userEmail");

        if (!userEmail) {
            alert("Please log in to reply.");
            return;
        }

        const requestData = {
            commentId,
            userEmail,
            action: "reply", // Action for replying
            text: replyText, // Use 'text' to match the server-side expected key
            replyUserName: userName,
        };

        try {
            const response = await axios.put("/api/comments", requestData);
            if (response.status === 200) {
                // Update the replies state with the new reply
                // Assuming 'response.data.reply' contains the populated reply
                setCurrentReplies((prevReplies) => [
                    ...prevReplies,
                    response.data.reply, // Directly add the new reply object
                ]);
                setReplyText("");
                setIsReplying(false);
            }
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            {/* Reply and Toggle Replies */}
            <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-blue-400 hover:underline"
            >
                {showReplies
                    ? "Hide Replies"
                    : `${currentReplies.length} ${currentReplies.length === 1 ? "Reply" : "Replies"
                    }`}
            </button>
            <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-blue-400 hover:underline"
            >
                {isReplying ? "Cancel" : "Reply"}
            </button>

            {/* Reply Form */}
            {isReplying && (
                <div className="mt-4 space-y-2">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        className="w-full p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md"
                    />
                    <button
                        onClick={handleReplySubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Submit Reply
                    </button>
                </div>
            )}

            {/* Replies List */}
            {showReplies && (
                <div className="mt-2 space-y-2">
                    {currentReplies.map((reply, index) => (
                        <div
                            key={index}
                            className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-inner text-gray-300"
                        >
                            <div className="flex items-center space-x-3">
                                {reply.userId?.profileAvatar ? (
                                    <img
                                        src={reply.userId.profileAvatar} // Use profileAvatar from populated userId
                                        alt="User Avatar"
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                        <FaUser className="text-gray-400 text-sm sm:text-lg" />
                                    </div>
                                )}
                                <span className="font-semibold text-gray-200 text-sm sm:text-base">
                                    {reply.userId?.name || "Anonymous"}
                                </span>
                            </div>
                            <p>{reply.text}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
