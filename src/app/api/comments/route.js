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


export async function PUT(req) {
    const { commentId, userEmail, action, text, replyUserName } = await req.json();

    if (!commentId || !userEmail || !action) {
        return new Response("Missing required fields", { status: 400 });
    }

    try {
        await dbConnect();

        // Find the user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        // Find the parent comment by ID
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return new Response("Parent comment not found", { status: 404 });
        }

        // Handle likes/unlikes
        const hasLiked = parentComment.likes.includes(user._id);

        if (action === "like") {
            if (!hasLiked) {
                parentComment.likes.push(user._id); // Add user ID to likes array
            }
        } else if (action === "unlike") {
            if (hasLiked) {
                parentComment.likes = parentComment.likes.filter(
                    (id) => !id.equals(user._id) // Remove user ID from likes array
                );
            }
        } else if (action === "reply") {
            if (!text) {
                return new Response("Missing reply text", { status: 400 });
            }

            // Create a new reply object
            const reply = {
                text,
                userId: user._id,
                userName: replyUserName || "Anonymous",  // Default to "Anonymous" if no userName
            };

            // Add the reply to the parent comment
            parentComment.replies.push(reply);

            // Save the updated comment with the reply
            await parentComment.save();

            // Populate the userId of the reply with the user details (name and profileAvatar)
            const populatedReply = await parentComment.populate({
                path: 'replies.userId',
                select: 'name profileAvatar' // Populate both name and profileAvatar
            });

            // Return the new reply with populated user data (name and profileAvatar)
            const newReply = populatedReply.replies.pop(); // Get the last reply that was added
            return new Response(
                JSON.stringify({ reply: newReply }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } else {
            return new Response("Invalid action", { status: 400 });
        }

        // Save the updated comment for likes/unlikes
        await parentComment.save();

        return new Response(
            JSON.stringify({ likes: parentComment.likes }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error updating comment:", error);
        return new Response("Failed to update comment", { status: 500 });
    }
}




export async function POST(req) {
    try {
        const { text, trackId, userEmail } = await req.json();

        if (!text || !trackId || !userEmail) {
            return new Response("Missing required fields", { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ email: userEmail });
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

