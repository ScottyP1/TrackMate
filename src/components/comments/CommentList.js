import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentItem from "./CommentItem";

export default function CommentList() {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // Fetch comments on component mount
        const fetchComments = async () => {
            try {
                const response = await axios.get("/api/comments");
                if (response.status === 200) {
                    setComments(response.data); // Assuming the response is an array of comments
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, []);

    return (
        <div className="comment-list">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} />
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
}
