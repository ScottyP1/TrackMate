'use client';
import { useContext, useEffect } from 'react';
import DOMPurify from 'dompurify'; // Keep import for sanitizing searchTerm if needed
import { Context as TrackContext } from '@/context/TrackContext';
import SearchBar from '@/components/SearchBar';
import { TrackCard } from '@/components/Track/TrackCard';
import { TrackCardSkeleton } from '@/components/Track/TrackCardSkeleton';

export default function Tracks() {
    const { state, fetchTracks, setZipCode, setRadius } = useContext(TrackContext);

    const handleSearch = async (searchTerm, radius) => {
        const sanitizedSearchTerm = DOMPurify.sanitize(searchTerm);
        const isZipCode = /^\d{5}$/.test(sanitizedSearchTerm);

        if (isZipCode) {
            setZipCode(sanitizedSearchTerm);
            setRadius(radius);
            fetchTracks(sanitizedSearchTerm, radius);
        } else {
            fetchTracks(sanitizedSearchTerm, radius);
        }
    }

    const renderTrackCardOrSkeleton = () => {
        if (state.loading) {
            // If loading, show a skeleton for each track
            return Array(4).fill(null).map((_, index) => <TrackCardSkeleton key={index} />);
        }

        if (state.tracks.length === 0) {
            return <p className="text-center text-lg col-span-full mt-12">Enter your ZIP code or track name to get started.</p>;
        }

        // Render the TrackCard component for each track
        return state.tracks.map((track) => (
            <TrackCard key={track._id || track.track_id} track={track} />
        ));
    };

    return (
        <div className="track-list p-4 mt-24">
            <div className="w-full min-w-xl mx-auto mb-4">
                <SearchBar onSearch={handleSearch} />
            </div>
            <h1 className='text-center text-sm'>If you're a track owner please email us and claim your track</h1>
            {state.errorMessage && (
                <p className="text-center text-lg text-red-500 mt-4">{state.errorMessage}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4">
                {renderTrackCardOrSkeleton()}
            </div>
        </div>
    );
}
