'use client'
import { useContext, useEffect } from 'react';
import { Context as TrackContext } from '@/context/TrackContext';
import SearchBar from '@/components/SearchBar';
import { TrackCard } from '@/components/Track/TrackCard';
import DOMPurify from 'dompurify';

export default function Tracks() {
    const { state, fetchTracks, handleInvalidZipCode, loading, errorMessage } = useContext(TrackContext);

    // Get zipCode and radius from the context state
    const { zipCode, radius } = state;

    const handleSearch = async (zip, radius) => {
        // Sanitize inputs
        const sanitizedZip = DOMPurify.sanitize(zip);
        const sanitizedRadius = DOMPurify.sanitize(radius);

        // If zip code is invalid, clear the tracks and set the error via context
        if (!/^\d{5}$/.test(sanitizedZip)) {
            handleInvalidZipCode();  // Handle invalid zip code via context
        }

        // Fetch tracks with the sanitized values
        fetchTracks(sanitizedZip, sanitizedRadius);
    };

    useEffect(() => {
        if (zipCode && radius) {
            handleSearch(zipCode, radius);
        }
    }, [zipCode, radius]); // Trigger search whenever zipCode or radius changes

    return (
        <div className="track-list p-4 mt-24">
            <div className="w-full min-w-xl mx-auto mb-4">
                <SearchBar onSearch={handleSearch} />
            </div>

            {loading && <p>Loading...</p>}

            {errorMessage && (
                <p className="text-center text-lg text-red-500 mt-4">{errorMessage}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-12">
                {state.tracks.length > 0 ? (
                    state.tracks.map((track) => (
                        <TrackCard key={track._id || track.track_id} track={track} />
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
