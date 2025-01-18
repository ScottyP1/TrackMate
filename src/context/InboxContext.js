'use client';

import createDataContext from '@/context/createDataContext';
import axiosInstance from '@/api/axios';
import Cookies from 'js-cookie';

// Reducer function to manage inbox-related state
const inboxReducer = (state, action) => {
    switch (action.type) {
        case 'set_inbox':
            return { ...state, inbox: action.payload, loading: false };
        case 'set_message':
            return { ...state, selectedMessage: action.payload, loading: false };
        case 'set_loading':
            return { ...state, loading: action.payload };
        case 'add_error':
            return { ...state, errorMessage: action.payload, loading: false };
        case 'clear_error':
            return { ...state, errorMessage: '', loading: false };
        case 'send_message':
            return {
                ...state,
                inbox: state.inbox.map(conversation =>
                    conversation.conversationId === action.payload.conversationId
                        ? { ...conversation, messages: [...conversation.messages, action.payload.newMessage] } : conversation),
                loading: false
            };
        default:
            return state;
    }
};

// Actions

// Fetch all conversations (grouped messages for inbox)
const fetchInbox = (dispatch) => async (userEmail) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.get(`/Inbox?userEmail=${userEmail}`);
        dispatch({ type: 'set_inbox', payload: response.data });
        dispatch({ type: 'clear_error' });
    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Error fetching messages' });
    }
};

// Make sure `fetchMessage` is fetching the conversation by `conversationId`
const fetchMessage = (dispatch) => async (conversationId) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.get(`/Inbox/${conversationId}`); // Fetch the conversation
        dispatch({ type: 'set_message', payload: response.data }); // Store the fetched message
        dispatch({ type: 'clear_error' });
    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Failed to fetch conversation' });
    }
};


const sendMessage = (dispatch) => async (senderEmail, receiverEmail, messageText, conversationId) => {
    const token = Cookies.get('authToken');
    if (!token) {
        dispatch({ type: 'add_error', payload: 'Unauthorized' });
        return;
    }
    if (!messageText) {
        dispatch({ type: 'add_error', payload: 'Message text is required' });
        return;
    }
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.post('/Inbox', {
            senderEmail,
            receiverEmail,
            text: messageText,
            conversationId
        });

        const newMessage = response.data;
        dispatch({
            type: 'send_message', payload: {
                conversationId,
                newMessage
            }
        });

    } catch (error) {
        dispatch({ type: 'add_error', payload: 'Failed to send message' });
    }
};


const clearError = (dispatch) => () => {
    dispatch({ type: 'clear_error' });
};

export const { Provider, Context } = createDataContext(
    inboxReducer,
    {
        fetchInbox,
        fetchMessage,
        sendMessage,
        clearError,
    },
    {
        inbox: [],
        selectedMessage: null,
        loading: false,
        errorMessage: '',
    }
);
