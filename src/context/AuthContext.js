'use client';
import createDataContext from "@/context/createDataContext";
import axiosInstance from "@/api/axios";
import Cookies from 'js-cookie';

// Reducer function to manage state
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
                errorMessage: '',
            };

        case 'add_email':
            return { ...state, userEmail: action.payload };

        case 'sign_out':
            return {
                ...state,
                token: null,
                errorMessage: '',
                userEmail: '',
                user: null,
                profileAvatar: '',
                favorites: [],
            };

        case 'update_favorites':
            return {
                ...state,
                user: { ...state.user, favorites: action.payload },
            };

        default:
            return state;
    }
};

const loadTokenAndUser = (dispatch) => () => {
    const token = Cookies.get('authToken');
    const userEmail = Cookies.get('userEmail');

    if (token && userEmail) {
        dispatch({ type: 'sign_in', payload: { token } });
        dispatch({ type: 'add_email', payload: userEmail });

        // Fetch user data based on token/email
        axiosInstance.get(`/Account?email=${userEmail}`)
            .then(response => {
                const user = response.data.user;
                dispatch({ type: 'fetch_user', payload: { ...user } });
            })
            .catch(error => {
                console.error("Failed to fetch user:", error);
                dispatch({ type: 'add_error', payload: 'Failed to fetch user data.' });
            });
    }
};

// Update favorites in the user's profile
const updateFavorites = (dispatch) => async (email, favorites) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.patch("/Account", { email, updates: { favorites } });
        const updatedUser = response.data.user;
        dispatch({ type: 'update_favorites', payload: updatedUser.favorites });
    } catch (error) {
        console.error("Error updating favorites:", error);
        dispatch({ type: 'add_error', payload: "Failed to update favorites." });
    } finally {
        dispatch({ type: 'set_loading', payload: false });
    }
};

// Update user information (like profile, email, etc.)
const updateUser = (dispatch) => async ({ email, updates }) => {
    dispatch({ type: "set_loading", payload: true });
    try {
        // Ensure email and updates are passed correctly
        const response = await axiosInstance.patch("/Account", { email, updates });
        const updatedUser = response.data.user;

        // If the profile avatar is updated, update the cookie
        if (updates.profileAvatar) {
            Cookies.set('profileAvatar', updates.profileAvatar, { expires: 7, path: '/', sameSite: 'Strict' });
        }
        if (updates.name) {
            Cookies.set('name', updates.name, { expires: 7, path: '/', sameSite: 'Strict' });
        }
        // Dispatch actions to update user in the app state
        dispatch({ type: "fetch_user", payload: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        const errorMessage =
            error.response?.data?.message || "Failed to update user data. Please try again.";
        dispatch({ type: "add_error", payload: errorMessage });
    } finally {
        dispatch({ type: "set_loading", payload: false });
    }
};



// Register a new user
const register = (dispatch) => async ({ name, email, password, profileAvatar }) => {
    dispatch({ type: 'clear_error' });
    dispatch({ type: 'set_loading', payload: true });
    try {
        const body = { name, email, password, profileAvatar };
        const response = await axiosInstance.post('/auth/Register', body);
        const { token, userId } = response.data;
        // Store user data in cookies
        Cookies.set('authToken', token, { expires: 7, path: '/', secure: true, sameSite: 'Strict' });
        Cookies.set('userEmail', email, { expires: 7, path: '/', secure: true, sameSite: 'Strict' });
        Cookies.set('userId', userId, { expires: 7, path: '/', secure: true, sameSite: 'Strict' });
        Cookies.set('name', name, { expires: 7, path: '/', secure: true, sameSite: 'Strict' });
        Cookies.set('profileAvatar', profileAvatar, { expires: 7, path: '/' });

        dispatch({ type: 'register', payload: { token, profileAvatar } });
        dispatch({ type: 'add_email', payload: email });
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Something went wrong during registration' });
    } finally {
        dispatch({ type: 'set_loading', payload: false });
    }
};

// Sign in the user
const signIn = (dispatch) => async ({ email, password }) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.post('/auth/Login', { email, password });

        // Extract data from response
        const { token, profileAvatar, name, userId } = response.data;

        if (!response.data.email) {
            throw new Error('Email not returned from the server');
        }

        Cookies.set('authToken', token, { expires: 7, path: '/', sameSite: 'Strict' });
        Cookies.set('userEmail', email, { expires: 7, path: '/', sameSite: 'Strict' });
        if (userId) Cookies.set('userId', userId, { expires: 7, path: '/', sameSite: 'Strict' });
        if (profileAvatar) Cookies.set('profileAvatar', profileAvatar, { expires: 7, path: '/', sameSite: 'Strict' });
        if (name) Cookies.set('name', name, { expires: 7, path: '/', sameSite: 'Strict' });
        // Dispatch actions
        dispatch({ type: 'sign_in', payload: { token } });
        dispatch({ type: 'add_email', payload: email });

        return Promise.resolve(); // Return a resolved Promise on success
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Invalid credentials' });
    } finally {
        dispatch({ type: 'set_loading', payload: false });
    }
};


// Sign out the user
const signOut = (dispatch) => () => {
    Cookies.remove('authToken');
    Cookies.remove('userEmail');
    Cookies.remove('userId');
    Cookies.remove('name')
    Cookies.remove('profileAvatar');
    Cookies.remove('searchTerm');
    dispatch({ type: 'sign_out' });
};

// Clear any error message before making a request
const clearError = (dispatch) => () => {
    dispatch({ type: 'clear_error' });
};

// Export the context provider and actions
export const { Provider, Context } = createDataContext(
    authReducer,
    { register, signIn, signOut, clearError, loadTokenAndUser, updateUser, updateFavorites },
    { token: null, user: null, favorites: [], errorMessage: '', loading: false }
);
