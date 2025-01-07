'use client';
import { useEffect } from 'react';
import createDataContext from '@/context/createDataContext';
import axiosInstance from '@/api/axios';

// Reducer function to manage track state
const trackReducer = (state, action) => {
    switch (action.type) {
        case 'fetch_tracks':
            return { ...state, tracks: action.payload, loading: false };
        case 'fetch_track':
            return { ...state, track: action.payload, loading: false };
        case 'add_error':
            return { ...state, errorMessage: action.payload, loading: false };
        case 'clear_error':
            return { ...state, errorMessage: '' };
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

const fetchTracksByZipCode = (dispatch) => async (zipCode, radius) => {
    dispatch({ type: 'set_loading', payload: true });

    try {
        // Include both zipCode and radius as query parameters
        const response = await axiosInstance.get('/Tracks', {
            params: { zipCode, radius }  // Passing both zipCode and radius
        });
        // If no tracks are found, we can check for an error message and dispatch it
        if (response.data.error) {
            dispatch({ type: 'add_error', payload: response.data.error });
        } else {
            dispatch({ type: 'fetch_tracks', payload: response.data });
        }
    } catch (e) {
        // If any other error occurs, dispatch a generic error
        dispatch({ type: 'add_error', payload: 'Failed to fetch tracks' });
    }
};



// Clear error messages
const clearError = (dispatch) => () => {
    dispatch({ type: 'clear_error' });
};

export const { Provider, Context } = createDataContext(
    trackReducer,
    { fetchAllTracks, fetchTrackById, fetchTracksByZipCode, clearError },
    { tracks: [], track: null, errorMessage: '', loading: false }
);
