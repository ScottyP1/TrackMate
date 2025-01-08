'use client';
import { useEffect } from 'react';
import createDataContext from '@/context/createDataContext';
import axiosInstance from '@/api/axios';

// Reducer function to manage track state
const trackReducer = (state, action) => {
    switch (action.type) {
        case 'set_zip_code':
            return { ...state, zipCode: action.payload };
        case 'set_radius':
            return { ...state, radius: action.payload };
        case 'fetch_tracks':
            return { ...state, tracks: action.payload, loading: false };
        case 'fetch_track':
            return { ...state, track: action.payload, loading: false };
        case 'add_error':
            return { ...state, errorMessage: action.payload, loading: false };
        case 'clear_error':
            return { ...state, errorMessage: '' };
        case 'clear_tracks':
            return { ...state, tracks: [] };
        case 'handle_invalid_zip_code':  // Handle invalid zip code error
            return { ...state, tracks: [], errorMessage: 'Invalid zip code. Please try again.', loading: false };
        case 'set_loading':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

// Fetch all tracks (to be called once when the app loads or on mount)
// trackContext.js (updated fetchTracks method)
const fetchAllTracks = (dispatch) => async () => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        let response = await axiosInstance.get('/Tracks');
        dispatch({ type: 'fetch_tracks', payload: response.data });
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Failed to fetch tracks' });
    }
};


// Fetch a specific track (to be called when a specific track is needed)
const fetchTrackById = (dispatch) => async (placeId) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        let response = await axiosInstance.get(`/Tracks/${placeId}`);
        dispatch({ type: 'fetch_track', payload: response.data });
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Failed to fetch track' });
    }
};

const fetchTracks = (dispatch) => async (searchTerm = '', radius = 10) => {
    dispatch({ type: 'set_loading', payload: true });

    try {
        let response;

        const isZipCode = /^\d{5}$/.test(searchTerm);

        if (!searchTerm) {
            response = await axiosInstance.get('/Tracks');
        } else if (isZipCode) {
            response = await axiosInstance.get('/Tracks', {
                params: { zipCode: searchTerm, radius }
            });
        } else {
            response = await axiosInstance.get('/Tracks', {
                params: { trackName: searchTerm }
            });
        }

        // If no tracks are returned, show an error message
        if (response.data.length === 0) {
            dispatch({ type: 'fetch_tracks', payload: [] });
            dispatch({ type: 'add_error', payload: 'No tracks found with the given name or zip code.' });
        } else {
            dispatch({ type: 'fetch_tracks', payload: response.data });
        }
    } catch (e) {
        if (e.response && e.response.status === 404) {
            // Handle 404 error (not found)
            dispatch({ type: 'fetch_tracks', payload: [] });
            dispatch({ type: 'add_error', payload: 'No tracks found for your search. Please try again.' });
        } else {
            // Handle other errors (e.g., network errors)
            dispatch({ type: 'add_error', payload: 'Failed to fetch tracks. Please try again later.' });
        }
    }
};



const clearTracks = (dispatch) => () => {
    dispatch({ type: 'clear_tracks' });
};
// Clear error messages
const clearError = (dispatch) => () => {
    dispatch({ type: 'clear_error' });
};
const handleInvalidZipCode = (dispatch) => () => {
    dispatch({ type: 'handle_invalid_zip_code' });
};
export const { Provider, Context } = createDataContext(
    trackReducer,
    { fetchAllTracks, fetchTrackById, fetchTracks, clearTracks, clearError, handleInvalidZipCode },
    { tracks: [], track: null, zipCode: null, radius: null, errorMessage: '', loading: false }
);
