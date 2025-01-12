'use client';
import { useEffect } from 'react';
import createDataContext from '@/context/createDataContext';
import axiosInstance from '@/api/axios';
import Cookies from 'js-cookie';

// Reducer function to manage track state
const trackReducer = (state, action) => {
    switch (action.type) {
        case 'set_zip_code':
            return { ...state, zipCode: action.payload };
        case 'set_radius':
            return { ...state, radius: action.payload };
        case 'fetch_tracks':
            return { ...state, tracks: action.payload, loading: false };
        case 'fetch_favorite_tracks':
            return { ...state, favoriteTracks: action.payload, loading: false };
        case 'fetch_track':
            return { ...state, track: action.payload, loading: false };
        case 'add_error':
            return { ...state, errorMessage: action.payload, loading: false };
        case 'clear_error':
            return { ...state, errorMessage: '' };
        case 'clear_tracks':
            return { ...state, tracks: [], favoriteTracks: [] };  // Clear both tracks and favorite tracks
        case 'handle_invalid_zip_code':
            return { ...state, tracks: [], zipCode: '', errorMessage: 'Invalid zip code. Please try again.', loading: false };
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
        return response.data;  // Return the track data
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Failed to fetch track' });
    }
};

const fetchFavoriteTracks = (dispatch) => async (trackIds) => {
    dispatch({ type: 'set_loading', payload: true });
    try {
        const trackPromises = trackIds.map(trackId => fetchTrackById(dispatch)(trackId));
        const trackData = await Promise.all(trackPromises);

        // Dispatch the fetched favorite tracks to the favoriteTracks state
        dispatch({ type: 'fetch_favorite_tracks', payload: trackData });
    } catch (error) {
        console.error('Error fetching favorite tracks:', error);
        dispatch({ type: 'add_error', payload: 'Failed to fetch favorite tracks' });
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
            dispatch({ type: 'clear_error' })
            Cookies.set('searchTerm', searchTerm, { expires: 7, path: '/' });
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
const setZipCode = (dispatch) => (zipCode) => {
    Cookies.set('searchTerm', zipCode);
    dispatch({ type: 'set_zip_code', payload: zipCode });
};

const setRadius = (dispatch) => (radius) => {
    dispatch({ type: 'set_radius', payload: radius });
};

export const { Provider, Context } = createDataContext(
    trackReducer,
    { setZipCode, setRadius, fetchAllTracks, fetchTrackById, fetchFavoriteTracks, fetchTracks, clearTracks, clearError, handleInvalidZipCode },
    {
        tracks: [], favoriteTracks: [],
        track: null, zipCode: null, radius: null, errorMessage: '', loading: false
    }
);
