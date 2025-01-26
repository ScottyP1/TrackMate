'use client'
import createDataContext from '@/context/createDataContext';
import axiosInstance from '@/api/axios';

// Reducer function to manage comment-related state
const commentReducer = (state, action) => {
    switch (action.type) {
        case 'set_comments':
            return { ...state, comments: action.payload, loading: false };
        case 'add_comment':
            return { ...state, comments: [...state.comments, action.payload], loading: false };
        case 'add_reply':
            return {
                ...state,
                comments: state.comments.map(comment =>
                    comment._id === action.payload.commentId
                        ? { ...comment, replies: [...comment.replies, action.payload.reply] }
                        : comment
                ),
                loading: false,
            };
        case 'like_comment':
            return {
                ...state,
                comments: state.comments.map(comment =>
                    comment._id === action.payload.commentId
                        ? { ...comment, likes: action.payload.likes }
                        : comment
                ),
                loading: false,
            };
        case 'delete_comment':
            return {
                ...state,
                comments: state.comments.filter(comment => comment._id !== action.payload),
                loading: false,
            };
        case 'delete_reply':
            return {
                ...state,
                comments: state.comments.map(comment =>
                    comment._id === action.payload.commentId
                        ? {
                            ...comment,
                            replies: comment.replies.filter(reply => reply._id !== action.payload.replyId),
                        }
                        : comment
                ),
                loading: false,
            };

        case 'set_loading':
            return { ...state, loading: action.payload };
        case 'add_error':
            return { ...state, errorMessage: action.payload, loading: false };
        case 'clear_error':
            return { ...state, errorMessage: '', loading: false };
        default:
            return state;
    }
};


// Actions

// Fetch comments for a track
const fetchComments = (dispatch) => async (trackId) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.get(`/comments?trackId=${trackId}`);
        // Ensure the response contains the necessary fields
        const comments = Array.isArray(response.data.comments)
            ? response.data.comments.map(comment => ({
                ...comment,
                createdAt: new Date(comment.createdAt), // Parse createdAt to Date object for easier handling
            }))
            : [];
        dispatch({ type: 'set_comments', payload: comments });
    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Error fetching comments' });
    }
};


// Add a new comment
const addComment = (dispatch) => async (trackId, commentText, userId) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.post('/comments', {
            trackId,
            text: commentText,
            userId,
        });
        // Add the new comment to the state
        dispatch({ type: 'add_comment', payload: response.data.comment });
    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Error adding comment' });
    }
};


const likeComment = (dispatch) => async (commentId, userId) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const action = 'like'; // Action can be like/unlike
        const response = await axiosInstance.patch('/comments', {
            commentId,
            userId,
            action,
        });
        dispatch({
            type: 'like_comment',
            payload: { commentId, likes: response.data.likes },
        });
    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Error liking comment' });
    }
};


// Add a reply to a comment
const addReply = (dispatch) => async (commentId, replyText, userId) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.patch('/comments', {
            commentId,
            text: replyText,
            userId,
            action: 'reply',
        });

        // Directly update the specific comment's replies
        dispatch({
            type: 'add_reply',
            payload: { commentId, reply: response.data.reply },
        });
    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Error adding reply' });
    }
};

const deleteComment = (dispatch) => async (commentId, replyId) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const url = replyId
            ? `/comments?commentId=${commentId}&replyId=${replyId}`
            : `/comments?commentId=${commentId}`;
        const response = await axiosInstance.delete(url);

        if (response.status === 200) {
            if (replyId) {
                // Update state for replies
                dispatch({
                    type: 'delete_reply',
                    payload: { commentId, replyId },
                });
            } else {
                // Update state for comments
                dispatch({ type: 'delete_comment', payload: commentId });
            }
        }
    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Error deleting comment or reply' });
    }
};


// Clear error messages
const clearError = (dispatch) => () => {
    dispatch({ type: 'clear_error' });
};

export const { Provider, Context } = createDataContext(
    commentReducer,
    {
        fetchComments,
        addComment,
        likeComment,
        deleteComment,
        addReply,
        clearError,
    },
    {
        comments: [],
        loading: false,
        errorMessage: '',
    }
);