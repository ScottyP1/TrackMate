'use client'
import { useEffect, useContext, useState } from 'react';
import { Context as TrackContext } from '@/context/TrackContext';
import { TrackCard } from '@/components/Track/TrackCard'; // Import TrackCard component
import SearchBar from '@/components/SearchBar';

export default function Tracks() {
    const { state, fetchAllTracks, loading, errorMessage, fetchTracksByZipCode } = useContext(TrackContext);
    const [zipCode, setZipCode] = useState('');
    const [radius, setRadius] = useState('');

    useEffect(() => {
        fetchAllTracks(); // Automatically fetch all tracks when component mounts (initial load)
    }, []);

    const handleSearch = async (zip, radius) => {
        setZipCode(zip);
        setRadius(radius); // Set radius in state
        await fetchTracksByZipCode(zip, radius); // Trigger fetching filtered tracks by zip code and radius
    };

    return (
        <div className="track-list p-4 mt-24">
            {/* Search Bar Container with fixed width */}
            <div className="w-full min-w-xl mx-auto mb-4"> {/* max-width for container */}
                <SearchBar onSearch={handleSearch} />
            </div>

            {loading && <p>Loading...</p>}

            {/* Display specific error messages */}
            {errorMessage && (
                <p className="text-center text-lg text-red-500 mt-4">{errorMessage}</p>
            )}

            {/* Render the tracks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-12">
                {state.tracks.length > 0 ? (
                    state.tracks.map((track) => (
                        <TrackCard key={track._id} track={track} /> // Render TrackCard component
                    ))
                ) : (
                    <p className="text-center text-lg col-span-full">No tracks found in your area. Please try a different zip code.</p>
                )}
            </div>
        </div>
    );
}
