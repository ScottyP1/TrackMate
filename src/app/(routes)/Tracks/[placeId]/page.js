'use client';

import { useEffect, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Context as TrackContext } from '@/context/TrackContext';
import { useFavorite } from '@/hooks/useFavorite';
import CommentsSection from '@/components/comments/CommentsSection';
import ImageCarosel from '@/components/ImageCarosel';
import NotFound from '@/app/not-found';

const TrackDetailsPage = () => {
    const { state, fetchTrackById, clearError } = useContext(TrackContext);
    const pathname = usePathname();

    const placeId = pathname ? pathname.split('/').pop() : null;

    useEffect(() => {
        if (placeId) {
            fetchTrackById(placeId);
        }
    }, [placeId]);

    useEffect(() => {
        if (state.track || state.errorMessage) {
            clearError();
        }
    }, [state.track, state.errorMessage]);

    const track = state.track;
    // const { isFavorite, handleFavoriteClick } = useFavorite(placeId);

    // If no track found, render NotFound component
    if (!track) {
        return <NotFound />;
    }

    // Render the track details when the data is ready
    return (
        <div className="min-h-screen text-white flex flex-col items-center p-6 mt-12">
            <div className="w-full max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl space-y-6">
                {/* Track Logo and Name */}
                <div className="flex flex-col items-center space-y-4">
                    {track.logo ? (
                        <img
                            src={track.logo}
                            alt="Track Logo"
                            className="rounded-full max-w-[200px] max-h-[100px] md:max-w-[400px] mdmax-h-[100px]"
                        />
                    ) : (
                        <h1 className="text-5xl font-bold text-center">{track.name}</h1>
                    )}
                    <p className="text-center text-white text-xs md:text-xl">
                        {track.address}
                    </p>
                    <p className="text-center text-yellow-400 text-xl">
                        Rating: {track.rating || 'N/A'}
                    </p>

                    {/* Add to favorites button */}
                    {/* <button
                        className={`mt-4 px-6 py-2 rounded-full ${isFavorite ? 'bg-red-500' : 'bg-gray-700'} text-white font-semibold`}
                        onClick={handleFavoriteClick}
                    >
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button> */}
                </div>

                {/* Image carousel */}
                {track.images?.length > 0 && (
                    <ImageCarosel validImages={track.images.filter((image) => image)} />
                )}
                <div className="p-5 bg-black/50 rounded-b-xl">
                    <h2 className="text-xs text-gray-400">
                        Images provided by Google Places API
                    </h2>
                </div>
                {/* Comments Section */}
                {/* <CommentsSection trackId={track.id} /> */}
            </div>
        </div>
    );
};

export default TrackDetailsPage;
