import { dbConnect } from "@/lib/db";
import Comment from "@/lib/models/Comment";
import { NextResponse } from 'next/server';
import User from "@/lib/models/User";  // Import User model to fetch user by email

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get("trackId");

    if (!trackId) {
        return new Response("Track ID is required", { status: 400 });
    }

    try {
        await dbConnect();

        // Fetch top-level comments for the track
        const comments = await Comment.find({ trackId })
            .sort({ createdAt: -1 }) // Sort by latest
            .populate("userId", "name profileAvatar") // Populate main comment's userId with name and profileAvatar
            .populate("replies.userId", "name profileAvatar"); // Populate replies' userId with name and profileAvatar

        return new Response(JSON.stringify({ comments }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return new Response("Failed to fetch comments", { status: 500 });
    }
}


export async function PATCH(req) {
    const { commentId, userId, action, text, replyUserName } = await req.json();
    if (!commentId || !userId || !action) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        await dbConnect();

        // Find the user by userId instead of email
        const user = await User.findById(userId);  // Find by userId here
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Find the comment by ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        // Handle the 'like' or 'unlike' action
        if (action === "like" || action === "unlike") {
            const hasLiked = comment.likes.includes(user._id);

            if (action === "like" && !hasLiked) {
                // Add user ID to likes array
                comment.likes.push(user._id);
            } else if (action === "unlike" && hasLiked) {
                // Remove user ID from likes array
                comment.likes = comment.likes.filter(like => !like.equals(user._id));
            }
        }

        // Handle the 'reply' action
        if (action === "reply") {
            if (!text) {
                return NextResponse.json({ message: "Missing reply text" }, { status: 400 });
            }

            // Add the reply to the replies array
            const reply = {
                text,
                userId: user._id,
                userName: replyUserName || "Anonymous",  // Default to "Anonymous" if no userName
            };
            comment.replies.push(reply);
        }

        // Save the updated comment document
        await comment.save();

        // Return the updated comment with populated user data for replies
        const populatedComment = await comment.populate({
            path: 'replies.userId',
            select: 'name profileAvatar'

        });

        // Return the updated comment data (likes and replies)
        return NextResponse.json({ likes: populatedComment.likes, replies: populatedComment.replies }, {
            status: 200,
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ message: "Failed to update comment" }, { status: 500 });
    }
}





export async function POST(req) {
    try {
        const { text, trackId, userId } = await req.json();

        if (!text || !trackId || !userId) {
            return new Response("Missing required fields", { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(userId);
        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const comment = new Comment({
            text,
            trackId,
            userId: user._id,
        });

        await comment.save();
        const populatedComment = await comment.populate("userId", "name profileAvatar");

        return NextResponse.json(populatedComment, { status: 201 });
    } catch (err) {
        console.error("Error in comment submission:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
        return new Response("Comment ID is required", { status: 400 });
    }

    try {
        await dbConnect();

        // Find and delete the comment by ID
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return new Response("Comment not found", { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Comment deleted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return new Response("Failed to delete comment", { status: 500 });
    }
}

