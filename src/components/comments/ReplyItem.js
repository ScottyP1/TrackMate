import Link from "next/link";
import { FaTrash } from "react-icons/fa";

export default function ReplyItem({ reply, commentId, currentUserId, onDelete }) {
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this reply?")) {
            onDelete(commentId, reply._id); // Pass both comment ID and reply ID
        }
    };

    return (
        <div className="p-4 bg-black/[.5] shadow-md rounded-lg mb-2">
            <div className="flex justify-between items-center mb-3">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                    <Link href={`/Account/${reply.userId?._id}`}>
                        <img
                            src={reply.userId?.profileAvatar || "/default-avatar.png"}
                            alt="User Avatar"
                            className="w-[35px] h-[35px] rounded-full border-2 border-blue-500"
                        />
                    </Link>
                    <span className="text-white text-sm font-semibold">
                        {reply.userId?.name || "Anonymous"}
                    </span>
                </div>

                {/* Trash Icon */}
                {currentUserId === reply.userId?._id && (
                    <button
                        className="text-red-500 hover:text-red-700 transition-all duration-300"
                        onClick={handleDelete}
                    >
                        <FaTrash className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Reply Text */}
            <p className="text-white text-sm">{reply.text}</p>
        </div>
    );
}
