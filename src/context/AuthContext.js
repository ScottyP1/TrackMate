'use client'
import createDataContext from "@/context/createDataContext";
import axiosInstance from "@/api/axios";

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return { ...state, errorMessage: action.payload };

        case 'clear_error':
            return { ...state, errorMessage: '' };

        case 'set_loading':
            return { ...state, loading: action.payload };

        case 'fetch_user':
            return { ...state, user: action.payload };

        case 'register':
        case 'sign_in':
            return {
                ...state,
                token: action.payload.token,
                errorMessage: ''
            };

        case 'add_email':
            return { ...state, userEmail: action.payload };

        case 'sign_out':
            return {
                ...state,
                token: null,
                errorMessage: '',
                userEmail: ''
            };

        default:
            return state;
    }
};


// Clear any error before making a request
const clearError = (dispatch) => () => {
    dispatch({ type: 'clear_error' });
};

// Automatically load the token and email on app initialization
const loadToken = (dispatch) => () => {
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userEmail) {
        dispatch({ type: 'sign_in', payload: { token } });
        dispatch({ type: 'add_email', payload: userEmail }); // Load email as well
    }
};

const fetchUser = (dispatch) => async (email) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.get(`/Account?email=${email}`);
        const user = response.data.user;
        dispatch({ type: 'fetch_user', payload: user });

        // Optionally save the avatar in localStorage if not already there
        if (user.avatar && !localStorage.getItem('userAvatar')) {
            localStorage.setItem('profileAvatar', user.avatar);
        }
    } catch (error) {
        console.error("Failed to fetch user:", error);
        dispatch({ type: 'add_error', payload: 'Failed to fetch user data.' });
    } finally {
        dispatch({ type: 'set_loading', payload: false });
    }
};


const updateUser = (dispatch) => async ({ email, updates }) => {
    dispatch({ type: "set_loading", payload: true });
    try {
        const response = await axiosInstance.patch("/Account", { email, updates });
        const updatedUser = response.data.user;
        dispatch({ type: "fetch_user", payload: updatedUser }); // Update user in state
    } catch (error) {
        console.error("Error updating user:", error);

        const errorMessage =
            error.response?.data || "Failed to update user data. Please try again.";
        dispatch({ type: "add_error", payload: errorMessage });
    } finally {
        dispatch({ type: "set_loading", payload: false });
    }
};


const register = (dispatch) => async ({ name, email, password, profileAvatar }) => {
    dispatch({ type: 'clear_error' });
    dispatch({ type: 'set_loading', payload: true });
    try {
        const body = { name, email, password, profileAvatar }; // Send avatar field to backend
        const response = await axiosInstance.post('/auth/Register', body);
        const { token, profileAvatar: avatar } = response.data; // Assuming the avatar is returned from the backend

        // Save token, email, and avatar in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('profileAvatar', avatar); // Save avatar in localStorage

        // Dispatch the necessary actions
        dispatch({ type: 'register', payload: { token } });
        dispatch({ type: 'add_email', payload: email });
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Something went wrong' });
    } finally {
        dispatch({ type: 'set_loading', payload: false });
    }
};


const signIn = (dispatch) => async ({ email, password }) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.post('/auth/Login', { email, password });
        const { token, profileAvatar } = response.data; // Ensure profileAvatar is returned as well

        if (!response.data.email) {
            throw new Error('Email not returned from the server');
        }

        // Ensure the email is returned from the backend
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', email);  // Store email from the request
        localStorage.setItem('profileAvatar', profileAvatar); // Store avatar in localStorage

        dispatch({ type: 'sign_in', payload: { token } });
        dispatch({ type: 'add_email', payload: email }); // Add email to state
        return Promise.resolve(); // Return a resolved Promise on success
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Invalid credentials' });
    } finally {
        dispatch({ type: 'set_loading', payload: false });
    }
};




const signOut = (dispatch) => () => {
    console.log('Sign out called')
    localStorage.removeItem('authToken'); // Remove token from localStorage
    localStorage.removeItem('userEmail'); // Remove email from localStorage
    localStorage.removeItem('profileAvatar'); // Remove avatar from localStorage
    dispatch({ type: 'sign_out' }); // Update state to reflect user is logged out
};

export const { Provider, Context } = createDataContext(
    authReducer,
    { register, signIn, signOut, clearError, loadToken, fetchUser, updateUser }, // Export clearError as well
    { token: null, userEmail: '', user: null, errorMessage: '', loading: false }
);
