'use client';
import createDataContext from "@/context/createDataContext";
import axiosInstance from "@/api/axios";
import Cookies from 'js-cookie';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'add_error':
            return { ...state, errorMessage: action.payload };

        case 'clear_error':
            return { ...state, errorMessage: '' };

        case 'set_loading':
            return { ...state, loading: action.payload };

        case 'fetch_user':
            return {
                ...state,
                user: {
                    ...action.payload.user,  // Merge any existing user data
                    id: action.payload._id,
                    name: action.payload.name,
                    email: action.payload.email,
                    profileAvatar: action.payload.profileAvatar,
                    favorites: action.payload.favorites || []
                }
            };

        case 'fetch_other_user':
            return { ...state, visitedUser: action.payload };

        case 'register':
        case 'sign_in':
            return {
                ...state,
                token: action.payload.token,
                errorMessage: '',
                user: {
                    ...action.payload.user,  // Merge any existing user data
                    id: action.payload.userData._id,
                    name: action.payload.userData.name,
                    email: action.payload.userData.email,
                    profileAvatar: action.payload.userData.profileAvatar,
                    favorites: action.payload.userData.favorites || []  // Safe fallback for favorites
                }
            };

        case 'sign_out':
            return {
                ...state,
                token: null,
                errorMessage: '',
                user: null,
                visitedUser: null
            };

        case 'update_user':
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload,  // Update user profile with new data
                    favorites: action.payload.favorites || state.user.favorites || []
                }
            };

        default:
            return state;
    }
};

const loadTokenAndUser = (dispatch) => async () => {
    const token = Cookies.get('authToken');
    const userEmail = Cookies.get('userEmail');

    if (token && userEmail) {
        try {
            const response = await axiosInstance.get(`/Account?email=${userEmail}`)
            const userData = response.data.user;
            // Now dispatch sign_in with token and complete user data
            dispatch({ type: 'sign_in', payload: { token, userData } });
        }
        catch (error) {
            console.error("Failed to fetch user:", error);
            dispatch({ type: 'add_error', payload: 'Failed to fetch user data.' });
        }
    };
}

// Register a new user
const register = (dispatch) => async ({ name, email, password, profileAvatar }) => {
    dispatch({ type: 'clear_error' });
    dispatch({ type: 'set_loading', payload: true });

    try {
        const body = { name, email, password, profileAvatar };
        const response = await axiosInstance.post('/auth/Register', body);

        const { token, userId, favorites } = response.data;

        // Store user data in cookies
        Cookies.set('authToken', token, { expires: 1, path: '/', secure: true, sameSite: 'Strict' });
        Cookies.set('userEmail', email, { expires: 1, path: '/', sameSite: 'Strict' });

        // Dispatch register action with token and empty user data (favorites should be empty initially)
        dispatch({
            type: 'sign_in',
            payload: {
                token, userData: { userId, name, email, profileAvatar, favorites }
            }
        });
    } catch (e) {
        console.log(e.message)
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
        const { token, profileAvatar, name, userId, favorites } = response.data;
        if (!response.data.email) {
            throw new Error('Email not returned from the server');
        }
        // Store user data in cookies
        Cookies.set('authToken', token, { expires: 1, path: '/', sameSite: 'Strict' });
        Cookies.set('userEmail', email, { expires: 1, path: '/', sameSite: 'Strict' });
        // Dispatch sign_in action with token and userData (following the same structure as loadTokenAndUser)
        dispatch({
            type: 'sign_in',
            payload: {
                token, userData: { userId, name, email, profileAvatar, favorites }
            }
        });
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Invalid credentials' });
    } finally {
        dispatch({ type: 'set_loading', payload: false });
    }
};


// Fetch other user's profile (for visiting user profiles)
const fetchOtherUserProfile = (dispatch) => async (user) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const response = await axiosInstance.get(`/Account/${user}`);
        const userData = response.data.user;
        dispatch({ type: 'fetch_other_user', payload: userData });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        dispatch({ type: 'add_error', payload: 'Failed to fetch user profile.' });
    } finally {
        dispatch({ type: 'set_loading', payload: false });
    }
};

// Update user information (like profile, email, etc.)
const updateUser = (dispatch) => async ({ email, updates }) => {
    dispatch({ type: "set_loading", payload: true });
    try {
        const response = await axiosInstance.patch("/Account", { email, updates });
        const updatedUser = response.data.user;

        // Dispatch actions to update user in the app state
        dispatch({ type: "update_user", payload: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        const errorMessage = error.response?.data?.message || "Failed to update user data. Please try again.";
        dispatch({ type: "add_error", payload: errorMessage });
    } finally {
        dispatch({ type: "set_loading", payload: false });
    }
};

// Sign out the user
const signOut = (dispatch) => () => {
    Cookies.remove('authToken');
    Cookies.remove('userEmail');
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
    {
        fetchOtherUserProfile, register, signIn, signOut, clearError, loadTokenAndUser, updateUser
    },
    { token: null, user: null, visitedUser: null, errorMessage: '', loading: false }
);
