'use client'
import { useEffect, useContext, useState } from 'react';
import { Context as TrackContext } from '@/context/TrackContext';
import { TrackCard } from '@/components/Track/TrackCard';
import SearchBar from '@/components/SearchBar';
import DOMPurify from 'dompurify';

export default function Tracks() {
    // Destructure the necessary values and functions from the context
    const { state, fetchTracks, handleInvalidZipCode, loading, errorMessage } = useContext(TrackContext);

    // Local state to hold zipCode and radius from the search bar input
    const [zipCode, setZipCode] = useState('');
    const [radius, setRadius] = useState('');

    const handleSearch = async (zip, radius) => {
        // Sanitize inputs
        const sanitizedZip = DOMPurify.sanitize(zip);
        const sanitizedRadius = DOMPurify.sanitize(radius);

        // If zip code is invalid, clear the tracks and set the error via context
        if (!/^\d{5}$/.test(sanitizedZip)) {
            handleInvalidZipCode();  // Handle invalid zip code via context
        }

        // Set local state for zipCode and radius
        setZipCode(sanitizedZip);
        setRadius(sanitizedRadius);

        // Fetch tracks
        fetchTracks(sanitizedZip, sanitizedRadius); // Dispatch action to fetch tracks
    };

    return (
        <div className="track-list p-4 mt-24">
            <div className="w-full min-w-xl mx-auto mb-4">
                <SearchBar onSearch={handleSearch} />  {/* Search bar to trigger search */}
            </div>

            {/* Loading indicator */}
            {loading && <p>Loading...</p>}

            {/* Error message */}
            {errorMessage && (
                <p className="text-center text-lg text-red-500 mt-4">{errorMessage}</p>
            )}

            {/* Display tracks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-12">
                {state.tracks.length > 0 ? (
                    state.tracks.map((track) => (
                        <TrackCard key={track._id} track={track} />
                    ))
                ) : (
                    !loading && (
                        <p className="text-center text-lg col-span-full">No tracks found with the given name or zip code. Please try again.</p>
                    )
                )}
            </div>
        </div>
    );
}
