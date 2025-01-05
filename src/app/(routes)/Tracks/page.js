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
        fetchAllTracks(); // Automatically fetch all tracks when component mounts
    }, []);

    const handleSearch = (zip, radius) => {
        setZipCode(zip);
        setRadius(radius); // Set radius in state
        fetchTracksByZipCode(zip, radius); // Trigger fetching filtered tracks by zip code and radius
    };

    return (
        <div className="track-list p-4 mt-24">
            <SearchBar onSearch={handleSearch} />

            {loading && <p>Loading...</p>}
            {errorMessage && (
                <p className="text-red-500">{errorMessage}</p>  // Display error message
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
                {state.tracks && state.tracks.length > 0 ? (
                    state.tracks.map((track) => (
                        <TrackCard key={track._id} track={track} /> // Render TrackCard component
                    ))
                ) : (
                    <p className="text-center text-lg">No tracks available</p> // Show no tracks message
                )}
            </div>
        </div>
    );
}
